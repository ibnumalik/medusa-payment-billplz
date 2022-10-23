# Billplz payment provider for Medusa commerce

![Billplz medusa hackathon cover](/assets/cover.jpg?raw=true "Medusa hackathon - Billplz payment provider")

## Demo Link

[Demo page - With NextJS starter](https://mh-billplz.shaiful.my)

[NPM - Billplz payment hackathon](https://www.npmjs.com/package/medusa-payment-billplz)

## About

### Participants

| GitHub                                     | Discord        | Twitter                                         |
| :----------------------------------------- | :------------- | :---------------------------------------------- |
| [@ibnumalik](https://github.com/ibnumalik) | ibnumalik#3920 | [@ibnumalikmy](https://twitter.com/ibnumalikmy) |

### Description

A Medusa plugin to extend its payment ecosystem using Billplz - a fair payment platform.

### Preview

![Billplz medusa hackathon preview](/assets/preview.jpg?raw=true "Medusa hackathon - Billplz payment provider")

## Set up Project

### Prerequisites

- [Medusa Server](https://docs.medusajs.com/quickstart/quick-start) - Tested on v1.4.1
- Create an account in [Billplz](https://www.billplz.com/) and get API key by following the [documentation](https://www.billplz.com/api#direct-payment-gateway-bypass-billplz-bill-page)

### Installation

#### Install plugin package in Medusa backend

```bash
npm install medusa-payment-billplz
```

#### Configure the Billplz plugin

```env
BILLPLZ_COLLECTION_ID=<COLLECTION_ID>
BILLPLZ_API_KEY=<SECRET_KEY>
BILLPLZ_X_SIGNATURE_KEY=<XSIGNATURE_KEY>
STORE_URL=<STORE_URL>
BACKEND_URL=<BACKEND_URL>
BILLPLZ_SANDBOX=true
```

- `COLLECTION_ID` can be retrieved in Billplz billing page.
- `SECRET_KEY` and `BILLPLZ_X_SIGNATURE_KEY` is available in your account settings.
- `STORE_URL` is the store frontend url
- `BACKEND_URL` is medusa backend url

During development it’s highly recommended to set `BILLPLZ_SANDBOX` to true and ensure you have [sandbox accounts set up in Billplz](https://www.billplz-sandbox.com/).

Then in `medusa-config.js`, add Billplz `plugins` to the plugins array. This is some of the avaibale options that can be passed to the plugin:

```javascript
const plugins = [
  //other plugins...
  {
    resolve: `medusa-payment-billplz`,
    options: {
      api_key: BILLPLZ_API_KEY,
      x_signature_key: BILLPLZ_X_SIGNATURE_KEY,
      collection_id: BILLPLZ_COLLECTION_ID,
      production: !BILLPLZ_SANDBOX || false,
      store_url: STORE_URL,
      backend_url: BACKEND_URL
    }
  }
];

```

## Resources

- [Medusa - Create plugin](https://docs.medusajs.com/advanced/backend/plugins/create)
- [Medusa - How to install plugin](https://docs.medusajs.com/advanced/backend/plugins/overview/#how-to-install-a-plugin)
- [Billplz developer documentation](https://billplz.com/api)
- [Store example using this plugin](https://github.com/ibnumalik/medusa-billplz)

## TODO

- [ ] Add instruction to use in NextJS storefront starter.
- [ ] Add library to provide components and hooks to use this plugins.
