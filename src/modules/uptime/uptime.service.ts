import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { EnvService } from '../../config/env/env.service';

@Injectable()
export class UptimeService {
  private readonly logger = new Logger(UptimeService.name);

  constructor(private readonly envService: EnvService) { }

  async getMonitorStatus() {
    const apiKey = this.envService.get('UPTIMEROBOT_APIKEY');
    const monitorId = this.envService.get('UPTIMEROBOT_MONITOR_ID');
    const apiUrl = this.envService.get('UPTIMEROBOT_APIURL');

    try {
      // Uptime Robot v3 API: GET /monitors/{id}
      // Documentation suggests Bearer Token in Authorization header
      const response = await axios.get(`${apiUrl}/monitors/${monitorId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      // Response structure for v3 is usually { monitor: { ..., status: X } }
      const monitor = response.data;
      return { status: monitor.status };
    } catch (error) {
      this.logger.error(`Error fetching Uptime Robot status: ${error.message}`);

      // If the error is from axios, log the response if available
      if (axios.isAxiosError(error) && error.response) {
        this.logger.error(`Uptime Robot API error details: ${JSON.stringify(error.response.data)}`);
      }

      return { status: 0 }; // Unknown/Error
    }
  }
}
