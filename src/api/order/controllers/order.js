'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
    async create(ctx) {
        const result = await super.create(ctx);

        console.log('result', result);

        const midtransClient = require('midtrans-client');
        // Create Snap API instance
        let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: 'SB-Mid-server-v0rmVx0KfphtgbmkAhcl7Eiz',
            clientKey: 'SB-Mid-client-gsynS06ZB6H6zHza'
        });

        let parameter = {
            "transaction_details": {
                "order_id": result.data.id,
                "gross_amount": result.data.attributes.totalPrice
            }, "credit_card": {
                "secure": true
            }
        };


        let response = snap.createTransaction(parameter)

        // const midtransClient = require('midtrans-client');
        // // Create Core API instance
        // let core = new midtransClient.CoreApi({
        //     isProduction: false,
        //     serverKey: 'SB-Mid-server-v0rmVx0KfphtgbmkAhcl7Eiz',
        //     clientKey: 'SB-Mid-client-gsynS06ZB6H6zHza'
        // });

        // let parameter = {
        //     "payment_type": "gopay",
        //     "transaction_details": {
        //         "gross_amount": result.data.attributes.totalPrice,
        //         "order_id": result.data.id,
        //     },
        //     "credit_card": {
        //         "token_id": 'CREDIT_CARD_TOKEN', // change with your card token
        //         "authentication": true
        //     }
        // };

        // // charge transaction
        // let response = await core.charge(parameter)

        return response;
    }
}));

