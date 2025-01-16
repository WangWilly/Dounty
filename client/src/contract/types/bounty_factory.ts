/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/bounty_factory.json`.
 */
export type BountyFactory = {
  address: "HvZ9DweFNYWqV4WNf83cCWogUXmabZHsDNT29DaRUXvm";
  metadata: {
    name: "bountyFactory";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "closeV1";
      discriminator: [142, 97, 254, 127, 88, 243, 67, 40];
      accounts: [
        {
          name: "owner";
          writable: true;
          signer: true;
        },
        {
          name: "bounty";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 111, 117, 110, 116, 121];
              },
              {
                kind: "account";
                path: "bounty.owner";
                account: "bountyV1";
              },
              {
                kind: "account";
                path: "bounty.url";
                account: "bountyV1";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [];
    },
    {
      name: "createDonerV1";
      discriminator: [75, 220, 139, 172, 55, 196, 62, 111];
      accounts: [
        {
          name: "doner";
          writable: true;
          signer: true;
        },
        {
          name: "donerAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [100, 111, 110, 101, 114];
              },
              {
                kind: "account";
                path: "doner";
              },
              {
                kind: "account";
                path: "bounty";
              },
            ];
          };
        },
        {
          name: "bounty";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 111, 117, 110, 116, 121];
              },
              {
                kind: "account";
                path: "bounty.owner";
                account: "bountyV1";
              },
              {
                kind: "account";
                path: "bounty.url";
                account: "bountyV1";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "donation";
          type: "u64";
        },
        {
          name: "message";
          type: "string";
        },
      ];
    },
    {
      name: "createV1";
      discriminator: [17, 118, 164, 242, 200, 153, 149, 125];
      accounts: [
        {
          name: "owner";
          writable: true;
          signer: true;
        },
        {
          name: "bounty";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 111, 117, 110, 116, 121];
              },
              {
                kind: "account";
                path: "owner";
              },
              {
                kind: "arg";
                path: "url";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "title";
          type: "string";
        },
        {
          name: "url";
          type: "string";
        },
        {
          name: "commissioners";
          type: {
            option: {
              vec: "pubkey";
            };
          };
        },
        {
          name: "assignee";
          type: {
            option: "pubkey";
          };
        },
      ];
    },
    {
      name: "issueV1";
      discriminator: [126, 20, 175, 176, 107, 125, 230, 169];
      accounts: [
        {
          name: "commissioner1";
          writable: true;
          signer: true;
        },
        {
          name: "commissioner2";
          signer: true;
          optional: true;
        },
        {
          name: "commissioner3";
          signer: true;
          optional: true;
        },
        {
          name: "commissioner4";
          signer: true;
          optional: true;
        },
        {
          name: "commissioner5";
          signer: true;
          optional: true;
        },
        {
          name: "bounty";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 111, 117, 110, 116, 121];
              },
              {
                kind: "account";
                path: "bounty.owner";
                account: "bountyV1";
              },
              {
                kind: "account";
                path: "bounty.url";
                account: "bountyV1";
              },
            ];
          };
        },
        {
          name: "assignee";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [];
    },
    {
      name: "updateV1";
      discriminator: [207, 157, 187, 63, 205, 149, 31, 165];
      accounts: [
        {
          name: "owner";
          writable: true;
          signer: true;
        },
        {
          name: "bounty";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 111, 117, 110, 116, 121];
              },
              {
                kind: "account";
                path: "owner";
              },
              {
                kind: "account";
                path: "bounty.url";
                account: "bountyV1";
              },
            ];
          };
        },
      ];
      args: [
        {
          name: "title";
          type: {
            option: "string";
          };
        },
        {
          name: "commissioners";
          type: {
            option: {
              vec: "pubkey";
            };
          };
        },
        {
          name: "assignee";
          type: {
            option: "pubkey";
          };
        },
      ];
    },
  ];
  accounts: [
    {
      name: "bountyV1";
      discriminator: [200, 129, 12, 237, 255, 32, 152, 154];
    },
    {
      name: "donerV1";
      discriminator: [187, 201, 69, 133, 107, 104, 97, 13];
    },
  ];
  errors: [
    {
      code: 6000;
      name: "stringTooLong";
      msg: "String too long";
    },
    {
      code: 6001;
      name: "duplicateCommissioners";
      msg: "Duplicate commissioners";
    },
    {
      code: 6002;
      name: "tooManyCommissioners";
      msg: "Too many commissioners";
    },
    {
      code: 6003;
      name: "notEnoughLamports";
      msg: "Not enough lamports";
    },
    {
      code: 6004;
      name: "notEnoughCommission";
      msg: "Not enough commission";
    },
    {
      code: 6005;
      name: "bountyNotAssigned";
      msg: "Bounty not assigned";
    },
    {
      code: 6006;
      name: "noCommissioners";
      msg: "No commissioners";
    },
    {
      code: 6007;
      name: "evenCommissioners";
      msg: "Even number of commissioners";
    },
    {
      code: 6008;
      name: "wrongAssignee";
      msg: "Wrong assignee";
    },
    {
      code: 6009;
      name: "wrongOwner";
      msg: "Wrong owner";
    },
    {
      code: 6010;
      name: "wrongUrl";
      msg: "Wrong url";
    },
    {
      code: 6011;
      name: "illegalClose";
      msg: "Illegal close";
    },
    {
      code: 6012;
      name: "illegalAssignee";
      msg: "Illegal assignee";
    },
  ];
  types: [
    {
      name: "bountyV1";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "pubkey";
          },
          {
            name: "timestamp";
            type: "i64";
          },
          {
            name: "donation";
            type: "u64";
          },
          {
            name: "assignee";
            type: {
              option: "pubkey";
            };
          },
          {
            name: "commissioners";
            type: {
              vec: "pubkey";
            };
          },
          {
            name: "title";
            type: "string";
          },
          {
            name: "url";
            type: "string";
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "donerV1";
      type: {
        kind: "struct";
        fields: [
          {
            name: "doner";
            type: "pubkey";
          },
          {
            name: "timestamp";
            type: "i64";
          },
          {
            name: "bounty";
            type: "pubkey";
          },
          {
            name: "donation";
            type: "u64";
          },
          {
            name: "message";
            type: "string";
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
  ];
};
