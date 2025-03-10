import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from "@nestjs/common";
import axios from "axios";

const { PAYMENT_REDIRECT_URL, PSK_SECRET_KEY } = process.env;

@Injectable()
export class PaystackService {
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
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          reference: `CHP_${Date.now()}`,
          amount: amount * 100,
          currency: "NGN",
          metadata,
          email,
          callback_url: `${PAYMENT_REDIRECT_URL}?provider=PSK&type=${metadata.type}`,
        },
        { headers: { Authorization: `Bearer ${PSK_SECRET_KEY}` } },
      );

      const { authorization_url: paymentLink, reference } = response.data.data;
      return { paymentLink, reference };
    } catch (error: any) {
      if (error.response)
        throw new ServiceUnavailableException({
          message: "Partner service is unavailable",
          failureDetails: {
            message: error.response.data.message,
            statusCode: error.response.status,
            errors: error.response.data.errors,
          },
        });
      throw new InternalServerErrorException(error.message);
    }
  }

  async verifyPayment(reference: string) {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: { Authorization: `Bearer ${PSK_SECRET_KEY}` },
        },
      );
      return { status: "success", data: response.data.data };
    } catch (error: any) {
      if (error.response)
        throw new ServiceUnavailableException({
          message: "Partner service is unavailable",
          failureDetails: {
            message: error.response.data.message,
            statusCode: error.response.status,
            errors: error.response.data.errors,
          },
        });
      throw new InternalServerErrorException(error.message);
    }
  }
}
