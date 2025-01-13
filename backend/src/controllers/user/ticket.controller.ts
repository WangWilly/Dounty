import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { TicketService } from './ticket.service';

import {
  TicketV1GetResp,
  TicketV1BatchCreateReq,
  TicketV1TransferReq,
  TicketV1ListResp,
  TicketV1CreateReq,
} from './dtos/ticket.dto';

////////////////////////////////////////////////////////////////////////////////

@Controller('api/ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  //////////////////////////////////////////////////////////////////////////////

  /**
   * Example:
   * curl --location 'localhost:3000/api/ticket/v1' \
   * --header 'Content-Type: application/json' \
   * --data '{
   *     "name": "test",
   *     "uri": "test_uri",
   *     "transferLimit": 10
   * }'
   */
  @Post('v1')
  async createTicket(@Body() req: TicketV1CreateReq): Promise<string> {
    return this.ticketService.createCoreAssetTicket(req);
  }

  /**
   * Example:
   * curl --location 'localhost:3000/api/ticket/v1/batch' \
   * --header 'Content-Type: application/json' \
   * --data '{
   *     "tickets": [
   *         {
   *             "name": "test1",
   *             "uri": "test_uri1",
   *             "transferLimit": 10
   *         },
   *         {
   *             "name": "test2",
   *             "uri": "test_uri2",
   *             "transferLimit": 20
   *         }
   *     ]
   * }'
   */
  @Post('v1/batch')
  async batchCreateTicket(
    @Body() req: TicketV1BatchCreateReq,
  ): Promise<string[]> {
    return this.ticketService.batchCreateCoreAssetTicket(req.tickets);
  }

  /**
   * Example:
   * curl --location 'localhost:3000/api/ticket/v1/systemPayer'
   */
  @Get('v1/systemPayer')
  async listSystemPayerTickets(): Promise<TicketV1ListResp> {
    const assets = await this.ticketService.listSystemPayerCoreAssetTickets();

    return TicketV1ListResp.fromAssets(assets);
  }

  /**
   * Example:
   * curl --location 'localhost:3000/api/ticket/v1/6b3qPggz2PWwdbUDL4AqP5CFhzov6yuf3mQePA1ues2P'
   */
  @Get('v1/:tid')
  async getTicket(@Param('tid') tid: string): Promise<TicketV1GetResp> {
    const asset = await this.ticketService.getCoreAssetTicket(tid);

    return TicketV1GetResp.fromAsset(asset);
  }

  /**
   * Example:
   * curl --location --request PATCH 'localhost:3000/api/ticket/v1/transfer' \
   * --header 'Content-Type: application/json' \
   * --data '{
   *     "ticketId": "6b3qPggz2PWwdbUDL4AqP5CFhzov6yuf3mQePA1ues2P",
   *     "to": "GAG3wvBFCV1b1dSv1LxiGxQZ5giVV3W7nqzXyLmS7oSh"
   * }'
   */
  // https://www.geeksforgeeks.org/difference-between-put-and-patch-request/
  @Patch('v1/transfer')
  async transferTicket(@Body() req: TicketV1TransferReq): Promise<void> {
    const asset = await this.ticketService.getCoreAssetTicket(req.ticketId);
    // TODO: error handling
    if (!asset) {
      throw new Error('asset not found');
    }
    await this.ticketService.transferCoreAssetTicket(req.ticketId, req.to);
  }
}
