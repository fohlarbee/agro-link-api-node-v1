import { BadRequestException, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class SecretsService {
  private readonly hcpClientId: string;
  private readonly hcpClientSecret: string;
  private readonly organizationId: string;
  private readonly projectId: string;
  private readonly appId: string;

  constructor(private readonly httpService: HttpService) {
    this.hcpClientId = process.env.HCP_CLIENT_ID;
    this.hcpClientSecret = process.env.HCP_CLIENT_SECRET;
    this.organizationId = process.env.HCP_ORGANIZATION_ID;
    this.projectId = process.env.HCP_PROJECT_ID;
    this.appId = process.env.HCP_APP_ID;
  }

  async getMhcpApiToken(): Promise<string> {
    try {
      const url = "https://auth.idp.hashicorp.com/oauth2/token";
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      };
      const data = new URLSearchParams({
        client_id: this.hcpClientId,
        client_secret: this.hcpClientSecret,
        grant_type: "client_credentials",
        audience: "https://api.hashicorp.cloud",
      });

      const response: any = await this.httpService.post(url, data.toString(), {
        headers,
      });
      const res = await response.toPromise();
      return res.data.access_token;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  async getSecrets(): Promise<any> {
    const url = `https://api.cloud.hashicorp.com/secrets/2023-06-13/organizations/${this.organizationId}/projects/${this.projectId}/apps/${this.appId}/open`;
    const headers = {
      Authorization: `Bearer ${await this.getMhcpApiToken()}`,
    };

    const response: any = await this.httpService.get(url, { headers });
    const res = await response.toPromise();

    return res.data.secrets;
  }
  async getSecretApi(token: string, name: string): Promise<string> {
    const url = `https://api.cloud.hashicorp.com/secrets/2023-06-13/organizations/${this.organizationId}/projects/${this.projectId}/apps/${this.appId}/open/${name}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: any = await this.httpService.get(url, { headers });
    const res = await response.toPromise();
    return res.data.secret.version.value;
  }

  async getSecret(name: string): Promise<string> {
    try {
      const token = await this.getMhcpApiToken();
      const secret = await this.getSecretApi(token, name);

      console.log(secret);
      return secret;
    } catch (error) {
      throw new BadRequestException("Invalid API token");
    }
  }
}
