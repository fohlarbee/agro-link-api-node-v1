import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from "@nestjs/common";
import axios from "axios";
import { CacheService } from "src/utils/services/cache.service";
const {
  MONNIFY_API_KEY,
  MONNIFY_DEFAULT_CONTRACT,
  MONNIFY_SECRET_KEY,
  MONNIFY_BASE_URL,
} = process.env;

@Injectable()
export class MonnifyService {
  private CACHE_KEY = "MNF_TOKEN";

  constructor(private cacheService: CacheService) {}

  async getAccessToken() {
    const cachedToken = await this.cacheService.get(this.CACHE_KEY);

    if (cachedToken) return cachedToken;

    const basicToken = Buffer.from(
      `${MONNIFY_API_KEY}:${MONNIFY_SECRET_KEY}`,
    ).toString("base64");

    const response = await axios.post(
      MONNIFY_BASE_URL + "/v1/auth/login",
      {},
      { headers: { Authorization: `Basic ${basicToken}` } },
    );

    const { accessToken, expiresIn } = response.data.responseBody;

    await this.cacheService.set(this.CACHE_KEY, accessToken, expiresIn);

    return accessToken;
  }

  async createPaymentLink({
    email,
    amount,
    metadata,
  }: {
    email: string;
    amount: number;
    metadata: Record<string, any>;
  }) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.post(
        `${MONNIFY_BASE_URL}/v1/merchant/transactions/init-transaction`,
        {
          paymentReference: `CHP_${Date.now()}`,
          amount: amount,
          currency: "NGN",
          metaData: metadata,
          customerEmail: email,
          contractCode: MONNIFY_DEFAULT_CONTRACT,
          redirectUrl: process.env.PAYMENT_REDIRECT_URL + "MNF",
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      const { checkoutUrl: paymentLink, transactionReference: reference } =
        response.data.responseBody;
      return { paymentLink, reference };
    } catch (error: any) {
      if (error.response)
        throw new ServiceUnavailableException({
          message: "Partner service is unavailable",
          failureDetails: {
            message: error.response.data.responseMessage,
            statusCode: error.response.status,
            errors: error.response.data.errors,
          },
        });
      throw new InternalServerErrorException(error.message);
    }
  }

  async fetchTransaction(reference: string) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `${MONNIFY_BASE_URL}/v2/transactions/${reference}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      const { responseBody } = response.data;
      return {
        data: responseBody,
        message: "Fetch successful",
        status: "success",
      };
    } catch (error) {
      if (error.response) {
        throw new ServiceUnavailableException({
          message: "Partner service is unavailable",
          failureDetails: {
            message: error.response.data.responseMessage,
            statusCode: error.response.status,
            errors: error.response.data.errors,
          },
        });
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
