import * as anchor from '@coral-xyz/anchor';
import { Injectable } from '@nestjs/common';

import { AnchorClientService } from '../commons/anchor-client/anchor-client.service';

import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

import { GlobalAppConfigService } from '../../../globals/app-config/app-config.service';
import { Keypair, Transaction } from '@solana/web3.js';
import { AssetV1 } from '@metaplex-foundation/mpl-core';

import * as fs from 'fs';
import { TicketHelperService } from '../helpers/ticket-helper/ticket-helper.service';
import { TicketV1CreateReq } from './dtos/ticket.dto';

import { CipherHelperService } from '../../../helpers/cipher-helper/cipher-helper.service';

////////////////////////////////////////////////////////////////////////////////

class ConfigSchema {
  @IsString()
  readonly SYSTEM_PAYER_KEYPAIR_FILE: string;
}

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class TicketService {
  private readonly systemPayer: anchor.web3.Keypair;

  constructor(
    private readonly globalAppConfigService: GlobalAppConfigService,
    private readonly anchorClientService: AnchorClientService,
    private readonly ticketHelperService: TicketHelperService,
    private readonly cipherHelperService: CipherHelperService,
  ) {
    // setup config
    const cfg = plainToInstance(
      ConfigSchema,
      this.globalAppConfigService.getUnstructedAppConfig(),
    );
    const errors = validateSync(cfg);
    if (errors.length) {
      throw new Error(errors.toString());
    }

    // resolve
    const pkPlain = fs.readFileSync(cfg.SYSTEM_PAYER_KEYPAIR_FILE);
    const pkJsonObj = JSON.parse(pkPlain.toString());
    const seed = Uint8Array.from(pkJsonObj).slice(0, 32);
    this.systemPayer = anchor.web3.Keypair.fromSeed(seed);
  }

  //////////////////////////////////////////////////////////////////////////////

  async createCoreAssetTicket(req: TicketV1CreateReq): Promise<string> {
    const tx = new Transaction();
    const asset = Keypair.generate();
    req.uri = this.cipherHelperService.encrypt(req.uri); // TODO: should be a new copy
    tx.add(
      await this.ticketHelperService.createCoreAssetTicketInstruction(
        asset,
        req,
        this.systemPayer,
      ),
    );

    await this.anchorClientService
      .getProvider()
      .sendAll([{ tx, signers: [asset, this.systemPayer] }]);

    return asset.publicKey.toBase58();
  }

  async batchCreateCoreAssetTicket(
    reqs: TicketV1CreateReq[],
  ): Promise<string[]> {
    const tx = new Transaction();
    const assets: anchor.web3.Keypair[] = [];
    // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
    for (const req of reqs) {
      const asset = Keypair.generate();
      req.uri = this.cipherHelperService.encrypt(req.uri); // TODO: should be a new copy
      tx.add(
        await this.ticketHelperService.createCoreAssetTicketInstruction(
          asset,
          req,
          this.systemPayer,
        ),
      );
      assets.push(asset);
    }

    // TODO: https://stackoverflow.com/questions/74242978/typeerror-provider-send-is-not-a-function-in-anchor
    await this.anchorClientService
      .getProvider()
      .sendAll([{ tx, signers: [...assets, this.systemPayer] }]);

    return assets.map((asset) => asset.publicKey.toBase58());
  }

  async transferCoreAssetTicket(
    assetAddress: string,
    newOwnerAddress: string,
  ): Promise<void> {
    const asset = new anchor.web3.PublicKey(assetAddress);
    const newOwner = new anchor.web3.PublicKey(newOwnerAddress);

    const tx = new Transaction();
    tx.add(
      await this.ticketHelperService.transferCoreAssetTicketInstruction(
        asset,
        this.systemPayer,
        newOwner,
      ),
    );

    await this.anchorClientService
      .getProvider()
      .sendAll([{ tx, signers: [this.systemPayer] }]);
  }

  async getCoreAssetTicket(assetAddress: string): Promise<AssetV1> {
    const asset = await this.anchorClientService.getMplCoreAsset(assetAddress);
    asset.uri = this.cipherHelperService.decrypt(asset.uri); // TODO: should be a new copy
    return asset;
  }

  async listSystemPayerCoreAssetTickets(): Promise<AssetV1[]> {
    const assets = await this.anchorClientService.getMplCoreAssetsByOwner(
      this.systemPayer.publicKey.toBase58(),
    );
    assets.forEach((asset) => {
      asset.uri = this.cipherHelperService.decrypt(asset.uri); // TODO: should be a new copy
    });
    return assets;
  }
}
