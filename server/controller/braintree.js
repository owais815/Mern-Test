var braintree = require("braintree");
require("dotenv").config();

// Lazy initialization of gateway to prevent server crash if credentials are missing
let gateway = null;

function getGateway() {
  if (!gateway) {
    const merchantId = process.env.BRAINTREE_MERCHANT_ID;
    const publicKey = process.env.BRAINTREE_PUBLIC_KEY;
    const privateKey = process.env.BRAINTREE_PRIVATE_KEY;

    if (!merchantId || !publicKey || !privateKey) {
      throw new Error("Braintree credentials are missing. Please set BRAINTREE_MERCHANT_ID, BRAINTREE_PUBLIC_KEY, and BRAINTREE_PRIVATE_KEY in your .env file");
    }

    gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox,
      merchantId: merchantId,
      publicKey: publicKey,
      privateKey: privateKey,
    });
  }
  return gateway;
}

class brainTree {
  ganerateToken(req, res) {
    try {
      const gatewayInstance = getGateway();
      gatewayInstance.clientToken.generate({}, (err, response) => {
        if (err) {
          return res.json(err);
        }
        return res.json(response);
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  paymentProcess(req, res) {
    try {
      const gatewayInstance = getGateway();
      let { amountTotal, paymentMethod } = req.body;
      gatewayInstance.transaction.sale(
        {
          amount: amountTotal,
          paymentMethodNonce: paymentMethod,
          options: {
            submitForSettlement: true,
          },
        },
        (err, result) => {
          if (err) {
            console.error(err);
            return res.json(err);
          }

          if (result.success) {
            console.log("Transaction ID: " + result.transaction.id);
            return res.json(result);
          } else {
            console.error(result.message);
          }
        }
      );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

const brainTreeController = new brainTree();
module.exports = brainTreeController;
