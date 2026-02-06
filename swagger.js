
window.onload = function () {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
    "swaggerDoc": {
      "openapi": "3.0.0",
      "paths": {
        "/": {
          "get": {
            "operationId": "AppController_getHello",
            "parameters": [],
            "responses": {
              "200": {
                "description": "Health check",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "tags": [
              "health"
            ]
          }
        },
        "/auth/submit-email": {
          "post": {
            "operationId": "AuthController_submitEmail",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SubmitEmailDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "email": "user@metropay.com",
                          "token": "jwt-token"
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "statusCode": 400,
                        "code": "email_exists",
                        "message": "Email already exists."
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "auth"
            ]
          }
        },
        "/auth/verify-email": {
          "post": {
            "operationId": "AuthController_verifyEmail",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/VerifyEmailDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "verified": true,
                          "token": "jwt-token"
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "statusCode": 400,
                        "code": "invalid_code",
                        "message": "Verification code is invalid."
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "auth"
            ]
          }
        },
        "/auth/complete-signup": {
          "post": {
            "operationId": "AuthController_completeSignup",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CompleteSignupDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "user": {
                            "id": "uuid",
                            "email": "user@metropay.com",
                            "adminRole": "STAFF",
                            "type": "BASIC",
                            "status": "ACTIVE",
                            "emailVerified": true,
                            "name": "Alex Morgan",
                            "phone": "+1 415 555 0198",
                            "createdAt": "2025-01-01T00:00:00.000Z"
                          },
                          "tokens": {
                            "accessToken": "access-token",
                            "refreshToken": "refresh-token"
                          }
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "auth"
            ]
          }
        },
        "/auth/login": {
          "post": {
            "operationId": "AuthController_login",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/LoginDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "user": {
                            "id": "uuid",
                            "email": "user@metropay.com",
                            "adminRole": "STAFF",
                            "type": "BASIC",
                            "status": "ACTIVE",
                            "emailVerified": true,
                            "name": null,
                            "phone": null,
                            "createdAt": "2025-01-01T00:00:00.000Z"
                          },
                          "tokens": {
                            "accessToken": "access-token",
                            "refreshToken": "refresh-token"
                          }
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "statusCode": 400,
                        "code": "wrong_password",
                        "message": "Password is incorrect."
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "auth"
            ]
          }
        },
        "/auth/oauth/google": {
          "post": {
            "operationId": "AuthController_googleOauth",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GoogleOauthDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "user": {
                            "id": "uuid",
                            "email": "user@metropay.com",
                            "adminRole": "STAFF",
                            "type": "BASIC",
                            "status": "ACTIVE",
                            "emailVerified": true,
                            "name": "User Name",
                            "phone": null,
                            "createdAt": "2025-01-01T00:00:00.000Z"
                          },
                          "tokens": {
                            "accessToken": "access-token",
                            "refreshToken": "refresh-token"
                          }
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "auth"
            ]
          }
        },
        "/auth/forgot-password": {
          "post": {
            "operationId": "AuthController_forgotPassword",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ForgotPasswordDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "email": "user@metropay.com",
                          "token": "jwt-token"
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "statusCode": 400,
                        "code": "user_not_found",
                        "message": "User not found."
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "auth"
            ]
          }
        },
        "/auth/forgot-password/verify": {
          "post": {
            "operationId": "AuthController_verifyForgotPassword",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/VerifyForgotPasswordDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "verified": true,
                          "token": "jwt-token"
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "statusCode": 400,
                        "code": "invalid_code",
                        "message": "Verification code is invalid."
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "auth"
            ]
          }
        },
        "/auth/reset-password": {
          "post": {
            "operationId": "AuthController_resetPassword",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ResetPasswordDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "reset": true
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "statusCode": 400,
                        "code": "invalid_token",
                        "message": "Token is invalid for this step."
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "auth"
            ]
          }
        },
        "/auth/pin/request": {
          "post": {
            "operationId": "AuthController_requestPin",
            "parameters": [],
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "email": "user@metropay.com"
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "auth"
            ]
          }
        },
        "/auth/pin/setup": {
          "post": {
            "operationId": "AuthController_setupPin",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SetupPinDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "updated": true,
                          "hasPin": true
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "statusCode": 400,
                        "code": "invalid_code",
                        "message": "Verification code is invalid."
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "auth"
            ]
          }
        },
        "/auth/refresh": {
          "post": {
            "operationId": "AuthController_refresh",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RefreshTokenDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "tokens": {
                            "accessToken": "access-token",
                            "refreshToken": "refresh-token"
                          }
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "statusCode": 400,
                        "code": "invalid_refresh_token",
                        "message": "Refresh token is invalid."
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "auth"
            ]
          }
        },
        "/auth/me": {
          "get": {
            "operationId": "AuthController_getProfile",
            "parameters": [],
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "id": "uuid",
                          "email": "user@metropay.com",
                          "adminRole": "STAFF",
                          "type": "BASIC",
                          "status": "ACTIVE",
                          "emailVerified": true,
                          "name": "Alex Morgan",
                          "phone": "+1 415 555 0198",
                          "barcodeValue": "MP-ABC123",
                          "createdAt": "2025-01-01T00:00:00.000Z"
                        },
                        "message": "OK",
                        "statusCode": 200
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "auth"
            ]
          }
        },
        "/auth/auth/login": {
          "post": {
            "operationId": "AdminAuthController_login",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/AdminLoginDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "user": {
                            "id": "uuid",
                            "email": "admin@metropay.com",
                            "adminRole": "ADMIN",
                            "type": "ADMIN",
                            "status": "ACTIVE",
                            "emailVerified": true,
                            "name": "Admin User",
                            "phone": null,
                            "barcodeValue": null,
                            "createdAt": "2026-01-01T00:00:00.000Z"
                          },
                          "tokens": {
                            "accessToken": "access-token",
                            "refreshToken": "refresh-token"
                          }
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "statusCode": 400,
                        "code": "invalid_credentials",
                        "message": "Invalid email or password."
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "auth"
            ]
          }
        },
        "/auth/auth/refresh": {
          "post": {
            "operationId": "AdminAuthController_refresh",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RefreshTokenDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "tokens": {
                            "accessToken": "access-token",
                            "refreshToken": "refresh-token"
                          }
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "auth"
            ]
          }
        },
        "/wallet/{userId}/balance": {
          "get": {
            "operationId": "WalletController_getBalance",
            "parameters": [
              {
                "name": "userId",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "userId": "uuid",
                          "walletId": "uuid",
                          "balance": "100.00"
                        },
                        "message": "OK",
                        "statusCode": 200
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "wallet"
            ]
          }
        },
        "/wallet/topup/init": {
          "post": {
            "operationId": "WalletController_initTopup",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/InitWalletTopupDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "reference": "mp_123456",
                          "authorizationUrl": "https://checkout.paystack.com/xyz",
                          "accessCode": "access_code"
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "wallet"
            ]
          }
        },
        "/wallet/user/by-barcode/{barcodeValue}": {
          "get": {
            "operationId": "WalletController_getUserByBarcode",
            "parameters": [
              {
                "name": "barcodeValue",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "user": {
                            "id": "uuid",
                            "name": "Driver Name",
                            "email": "driver@metropay.com",
                            "phone": "+2348012345678",
                            "barcodeValue": "MP-ABC123",
                            "adminRole": "STAFF",
                            "type": "BASIC"
                          }
                        },
                        "message": "OK",
                        "statusCode": 200
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "wallet"
            ]
          }
        },
        "/wallet/pay": {
          "post": {
            "operationId": "WalletController_payFromWallet",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/WalletPaymentDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "transactionId": "uuid",
                          "balance": "50.00"
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "wallet"
            ]
          }
        },
        "/wallet/remittance/pay": {
          "post": {
            "operationId": "WalletController_payRemittanceToAgent",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RemittancePayDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "transactionId": "uuid",
                          "balance": "50.00"
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "wallet"
            ]
          }
        },
        "/wallet/agent/collect": {
          "post": {
            "operationId": "WalletController_agentCollect",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/AgentCollectPaymentDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "transactionId": "uuid",
                          "balance": "75.00"
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "wallet"
            ]
          }
        },
        "/wallet/scan/pay": {
          "post": {
            "operationId": "WalletController_scanToPay",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ScanPaymentDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "transactionId": "uuid",
                          "balance": "75.00"
                        },
                        "message": "OK",
                        "statusCode": 201
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "wallet"
            ]
          }
        },
        "/wallet/topup/verify": {
          "post": {
            "operationId": "WalletController_verifyTopup",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/VerifyWalletTopupDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "walletId": "uuid",
                          "balance": "150.00"
                        },
                        "message": "OK",
                        "statusCode": 200
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "wallet"
            ]
          }
        },
        "/paystack/webhook": {
          "post": {
            "operationId": "PaystackWebhookController_handleWebhook",
            "parameters": [
              {
                "name": "x-paystack-signature",
                "required": true,
                "in": "header",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": ""
              }
            }
          }
        },
        "/transactions": {
          "get": {
            "operationId": "TransactionsController_getTransactions",
            "parameters": [
              {
                "name": "userId",
                "required": false,
                "in": "query",
                "example": "user-id",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "walletId",
                "required": false,
                "in": "query",
                "example": "wallet-id",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "type",
                "required": false,
                "in": "query",
                "example": "TOPUP",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "channel",
                "required": false,
                "in": "query",
                "example": "WALLET",
                "schema": {
                  "enum": [
                    "WALLET",
                    "CASH"
                  ],
                  "type": "string"
                }
              },
              {
                "name": "fromDate",
                "required": false,
                "in": "query",
                "example": "2026-01-01",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "toDate",
                "required": false,
                "in": "query",
                "example": "2026-01-31",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "reference",
                "required": false,
                "in": "query",
                "example": "ref_123",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "page",
                "required": false,
                "in": "query",
                "example": 1,
                "schema": {
                  "type": "number"
                }
              },
              {
                "name": "limit",
                "required": false,
                "in": "query",
                "example": 20,
                "schema": {
                  "type": "number"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "items": [],
                          "total": 0,
                          "page": 1,
                          "limit": 20
                        },
                        "message": "OK",
                        "statusCode": 200
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "transactions"
            ]
          }
        },
        "/transactions/admin": {
          "get": {
            "operationId": "TransactionsController_getAdminTransactions",
            "parameters": [
              {
                "name": "userId",
                "required": false,
                "in": "query",
                "example": "user-id",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "walletId",
                "required": false,
                "in": "query",
                "example": "wallet-id",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "type",
                "required": false,
                "in": "query",
                "example": "TOPUP",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "channel",
                "required": false,
                "in": "query",
                "example": "WALLET",
                "schema": {
                  "enum": [
                    "WALLET",
                    "CASH"
                  ],
                  "type": "string"
                }
              },
              {
                "name": "fromDate",
                "required": false,
                "in": "query",
                "example": "2026-01-01",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "toDate",
                "required": false,
                "in": "query",
                "example": "2026-01-31",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "reference",
                "required": false,
                "in": "query",
                "example": "ref_123",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "page",
                "required": false,
                "in": "query",
                "example": 1,
                "schema": {
                  "type": "number"
                }
              },
              {
                "name": "limit",
                "required": false,
                "in": "query",
                "example": 20,
                "schema": {
                  "type": "number"
                }
              },
              {
                "name": "agentId",
                "required": false,
                "in": "query",
                "example": "agent-id",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "items": [],
                          "total": 0,
                          "page": 1,
                          "limit": 20
                        },
                        "message": "OK",
                        "statusCode": 200
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "transactions"
            ]
          }
        },
        "/transactions/agent": {
          "get": {
            "operationId": "TransactionsController_getAgentTransactions",
            "parameters": [
              {
                "name": "userId",
                "required": false,
                "in": "query",
                "example": "user-id",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "walletId",
                "required": false,
                "in": "query",
                "example": "wallet-id",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "type",
                "required": false,
                "in": "query",
                "example": "TOPUP",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "channel",
                "required": false,
                "in": "query",
                "example": "WALLET",
                "schema": {
                  "enum": [
                    "WALLET",
                    "CASH"
                  ],
                  "type": "string"
                }
              },
              {
                "name": "fromDate",
                "required": false,
                "in": "query",
                "example": "2026-01-01",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "toDate",
                "required": false,
                "in": "query",
                "example": "2026-01-31",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "reference",
                "required": false,
                "in": "query",
                "example": "ref_123",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "page",
                "required": false,
                "in": "query",
                "example": 1,
                "schema": {
                  "type": "number"
                }
              },
              {
                "name": "limit",
                "required": false,
                "in": "query",
                "example": 20,
                "schema": {
                  "type": "number"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "items": [],
                          "total": 0,
                          "page": 1,
                          "limit": 20
                        },
                        "message": "OK",
                        "statusCode": 200
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "transactions"
            ]
          }
        },
        "/transactions/{id}": {
          "get": {
            "operationId": "TransactionsController_getTransactionById",
            "parameters": [
              {
                "name": "id",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "id": "uuid",
                          "walletId": "wallet-id",
                          "userId": "user-id",
                          "type": "DEBIT",
                          "channel": "WALLET",
                          "amount": "50.00",
                          "balanceBefore": "100.00",
                          "balanceAfter": "50.00",
                          "reference": "remit_123",
                          "meta": {
                            "source": "USER_WALLET"
                          },
                          "createdAt": "2026-01-01T00:00:00.000Z"
                        },
                        "message": "OK",
                        "statusCode": 200
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "transactions"
            ]
          }
        },
        "/users/basic": {
          "get": {
            "operationId": "UserController_getBasicUsers",
            "parameters": [
              {
                "name": "page",
                "required": false,
                "in": "query",
                "example": 1,
                "schema": {
                  "type": "number"
                }
              },
              {
                "name": "limit",
                "required": false,
                "in": "query",
                "example": 20,
                "schema": {
                  "type": "number"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "items": [
                            {
                              "id": "uuid",
                              "email": "user@metropay.com",
                              "adminRole": "STAFF",
                              "type": "BASIC",
                              "status": "ACTIVE",
                              "emailVerified": true,
                              "name": "Alex Morgan",
                              "phone": "+1 415 555 0198",
                              "barcodeValue": "MP-ABC123",
                              "createdAt": "2026-01-01T00:00:00.000Z"
                            }
                          ],
                          "total": 1,
                          "page": 1,
                          "limit": 20
                        },
                        "message": "OK",
                        "statusCode": 200
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "users"
            ]
          }
        },
        "/users/admin": {
          "get": {
            "operationId": "UserController_getAdminUsers",
            "parameters": [
              {
                "name": "page",
                "required": false,
                "in": "query",
                "example": 1,
                "schema": {
                  "type": "number"
                }
              },
              {
                "name": "limit",
                "required": false,
                "in": "query",
                "example": 20,
                "schema": {
                  "type": "number"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "items": [
                            {
                              "id": "uuid",
                              "email": "admin@metropay.com",
                              "adminRole": "ADMIN",
                              "type": "ADMIN",
                              "status": "ACTIVE",
                              "emailVerified": true,
                              "name": "Admin User",
                              "phone": null,
                              "barcodeValue": null,
                              "createdAt": "2026-01-01T00:00:00.000Z"
                            }
                          ],
                          "total": 1,
                          "page": 1,
                          "limit": 20
                        },
                        "message": "OK",
                        "statusCode": 200
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "users"
            ]
          }
        },
        "/users/agent": {
          "get": {
            "operationId": "UserController_getAgents",
            "parameters": [
              {
                "name": "page",
                "required": false,
                "in": "query",
                "example": 1,
                "schema": {
                  "type": "number"
                }
              },
              {
                "name": "limit",
                "required": false,
                "in": "query",
                "example": 20,
                "schema": {
                  "type": "number"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "items": [
                            {
                              "id": "uuid",
                              "email": "agent@metropay.com",
                              "adminRole": "STAFF",
                              "type": "AGENT",
                              "status": "ACTIVE",
                              "emailVerified": true,
                              "name": "Agent Name",
                              "phone": "+2348012345678",
                              "barcodeValue": null,
                              "createdAt": "2026-01-01T00:00:00.000Z"
                            }
                          ],
                          "total": 1,
                          "page": 1,
                          "limit": 20
                        },
                        "message": "OK",
                        "statusCode": 200
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "users"
            ]
          }
        },
        "/users/currentUser": {
          "patch": {
            "operationId": "UserController_updateCurrentUserProfile",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdateCurrentUserDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "id": "uuid",
                          "email": "user@metropay.com",
                          "adminRole": "STAFF",
                          "type": "BASIC",
                          "status": "ACTIVE",
                          "emailVerified": true,
                          "name": "Alex Morgan",
                          "phone": "+1 415 555 0198",
                          "barcodeValue": "MP-ABC123",
                          "hasPin": true,
                          "kycStatus": "PENDING",
                          "dojahWidgetUrl": null,
                          "createdAt": "2026-01-01T00:00:00.000Z"
                        },
                        "message": "OK",
                        "statusCode": 200
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "users"
            ]
          }
        },
        "/users": {
          "post": {
            "operationId": "UserController_createUser",
            "parameters": [],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreateUserDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "id": "uuid",
                          "email": "user@metropay.com",
                          "adminRole": "STAFF",
                          "type": "BASIC",
                          "status": "ACTIVE",
                          "emailVerified": true,
                          "name": "Alex Morgan",
                          "phone": "+1 415 555 0198",
                          "barcodeValue": null,
                          "createdAt": "2026-01-01T00:00:00.000Z"
                        },
                        "message": "OK",
                        "statusCode": 200
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "statusCode": 400,
                        "code": "email_exists",
                        "message": "Email already exists."
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "users"
            ]
          }
        },
        "/users/{id}": {
          "get": {
            "operationId": "UserController_getUserById",
            "parameters": [
              {
                "name": "id",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "id": "uuid",
                          "email": "user@metropay.com",
                          "adminRole": "STAFF",
                          "type": "BASIC",
                          "status": "ACTIVE",
                          "emailVerified": true,
                          "name": "Alex Morgan",
                          "phone": "+1 415 555 0198",
                          "barcodeValue": "MP-ABC123",
                          "createdAt": "2026-01-01T00:00:00.000Z"
                        },
                        "message": "OK",
                        "statusCode": 200
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "statusCode": 400,
                        "code": "user_not_found",
                        "message": "User not found."
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "users"
            ]
          },
          "patch": {
            "operationId": "UserController_updateUser",
            "parameters": [
              {
                "name": "id",
                "required": true,
                "in": "path",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "requestBody": {
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdateUserStatusDto"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "success": true,
                        "content": {
                          "id": "uuid",
                          "email": "user@metropay.com",
                          "adminRole": "STAFF",
                          "type": "BASIC",
                          "status": "SUSPENDED",
                          "emailVerified": true,
                          "name": "Alex Morgan",
                          "phone": "+1 415 555 0198",
                          "barcodeValue": "MP-ABC123",
                          "createdAt": "2026-01-01T00:00:00.000Z"
                        },
                        "message": "OK",
                        "statusCode": 200
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "",
                "content": {
                  "application/json": {
                    "schema": {
                      "example": {
                        "statusCode": 400,
                        "code": "user_not_found",
                        "message": "User not found."
                      }
                    }
                  }
                }
              }
            },
            "tags": [
              "users"
            ]
          }
        }
      },
      "info": {
        "title": "Metropay API",
        "description": "Metropay backend API",
        "version": "1.0",
        "contact": {}
      },
      "tags": [],
      "servers": [],
      "components": {
        "schemas": {
          "SubmitEmailDto": {
            "type": "object",
            "properties": {
              "email": {
                "type": "string",
                "example": "user@metropay.com"
              }
            },
            "required": [
              "email"
            ]
          },
          "VerifyEmailDto": {
            "type": "object",
            "properties": {
              "code": {
                "type": "string",
                "example": "123456"
              },
              "token": {
                "type": "string",
                "example": "jwt-token-from-submit-email"
              }
            },
            "required": [
              "code",
              "token"
            ]
          },
          "CompleteSignupDto": {
            "type": "object",
            "properties": {
              "token": {
                "type": "string",
                "example": "jwt-token-from-verify-email"
              },
              "password": {
                "type": "string",
                "example": "Passw0rd!"
              },
              "name": {
                "type": "string",
                "example": "Alex Morgan"
              },
              "phone": {
                "type": "string",
                "example": "+1 415 555 0198"
              }
            },
            "required": [
              "token",
              "password",
              "name",
              "phone"
            ]
          },
          "LoginDto": {
            "type": "object",
            "properties": {
              "email": {
                "type": "string",
                "example": "user@metropay.com"
              },
              "password": {
                "type": "string",
                "example": "Passw0rd!"
              },
              "type": {
                "type": "string",
                "enum": [
                  "BASIC",
                  "AGENT",
                  "ADMIN"
                ],
                "example": "BASIC"
              }
            },
            "required": [
              "email",
              "password",
              "type"
            ]
          },
          "GoogleOauthDto": {
            "type": "object",
            "properties": {
              "idToken": {
                "type": "string",
                "example": "google-id-token"
              }
            },
            "required": [
              "idToken"
            ]
          },
          "ForgotPasswordDto": {
            "type": "object",
            "properties": {
              "email": {
                "type": "string",
                "example": "user@metropay.com"
              }
            },
            "required": [
              "email"
            ]
          },
          "VerifyForgotPasswordDto": {
            "type": "object",
            "properties": {
              "token": {
                "type": "string",
                "example": "jwt-token"
              },
              "code": {
                "type": "string",
                "example": "123456"
              }
            },
            "required": [
              "token",
              "code"
            ]
          },
          "ResetPasswordDto": {
            "type": "object",
            "properties": {
              "token": {
                "type": "string",
                "example": "jwt-token"
              },
              "password": {
                "type": "string",
                "example": "MySecurePass123"
              }
            },
            "required": [
              "token",
              "password"
            ]
          },
          "SetupPinDto": {
            "type": "object",
            "properties": {
              "code": {
                "type": "string",
                "example": "123456"
              },
              "pin": {
                "type": "string",
                "example": "1234"
              }
            },
            "required": [
              "code",
              "pin"
            ]
          },
          "RefreshTokenDto": {
            "type": "object",
            "properties": {
              "refreshToken": {
                "type": "string",
                "example": "refresh-token"
              }
            },
            "required": [
              "refreshToken"
            ]
          },
          "AdminLoginDto": {
            "type": "object",
            "properties": {
              "email": {
                "type": "string",
                "example": "admin@metropay.com"
              },
              "password": {
                "type": "string",
                "example": "password"
              },
              "type": {
                "type": "string",
                "enum": [
                  "BASIC",
                  "AGENT",
                  "ADMIN"
                ],
                "example": "ADMIN"
              }
            },
            "required": [
              "email",
              "password",
              "type"
            ]
          },
          "InitWalletTopupDto": {
            "type": "object",
            "properties": {
              "email": {
                "type": "string",
                "example": "user@metropay.com"
              },
              "amount": {
                "type": "number",
                "example": 2500
              }
            },
            "required": [
              "email",
              "amount"
            ]
          },
          "WalletPaymentDto": {
            "type": "object",
            "properties": {
              "amount": {
                "type": "number",
                "example": 500
              },
              "pin": {
                "type": "string",
                "example": "1234"
              }
            },
            "required": [
              "amount",
              "pin"
            ]
          },
          "RemittancePayDto": {
            "type": "object",
            "properties": {
              "agentId": {
                "type": "string",
                "example": "agent-id"
              },
              "amount": {
                "type": "number",
                "example": 500
              },
              "pin": {
                "type": "string",
                "example": "1234"
              }
            },
            "required": [
              "agentId",
              "amount",
              "pin"
            ]
          },
          "AgentCollectPaymentDto": {
            "type": "object",
            "properties": {
              "userId": {
                "type": "string",
                "example": "user-id"
              },
              "amount": {
                "type": "number",
                "example": 500
              },
              "paymentType": {
                "type": "string",
                "example": "wallet",
                "enum": [
                  "wallet",
                  "cash"
                ]
              },
              "pin": {
                "type": "string",
                "example": "1234"
              }
            },
            "required": [
              "userId",
              "amount",
              "paymentType"
            ]
          },
          "ScanPaymentDto": {
            "type": "object",
            "properties": {
              "payeeId": {
                "type": "string",
                "example": "user-id"
              },
              "amount": {
                "type": "number",
                "example": 500
              },
              "paymentCategory": {
                "type": "string",
                "example": "Parking fee"
              },
              "remarks": {
                "type": "string",
                "example": "Paid at gate C"
              },
              "pin": {
                "type": "string",
                "example": "1234"
              }
            },
            "required": [
              "payeeId",
              "amount",
              "paymentCategory",
              "pin"
            ]
          },
          "VerifyWalletTopupDto": {
            "type": "object",
            "properties": {
              "reference": {
                "type": "string",
                "example": "paystack-reference"
              }
            },
            "required": [
              "reference"
            ]
          },
          "UpdateCurrentUserDto": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string",
                "example": "Alex Morgan"
              },
              "phone": {
                "type": "string",
                "example": "+1 415 555 0198"
              }
            }
          },
          "CreateUserDto": {
            "type": "object",
            "properties": {
              "email": {
                "type": "string",
                "example": "user@metropay.com"
              },
              "name": {
                "type": "string",
                "example": "Alex Morgan"
              },
              "phone": {
                "type": "string",
                "example": "+1 415 555 0198"
              },
              "type": {
                "type": "string",
                "enum": [
                  "BASIC",
                  "AGENT",
                  "ADMIN"
                ],
                "example": "BASIC"
              },
              "adminRole": {
                "type": "string",
                "enum": [
                  "STAFF",
                  "ADMIN"
                ],
                "example": "STAFF"
              }
            },
            "required": [
              "email",
              "type"
            ]
          },
          "UpdateUserStatusDto": {
            "type": "object",
            "properties": {
              "status": {
                "type": "string",
                "example": "SUSPENDED",
                "enum": [
                  "ACTIVE",
                  "SUSPENDED"
                ]
              }
            },
            "required": [
              "status"
            ]
          }
        }
      }
    },
    "customOptions": {}
  };
  url = options.swaggerUrl || url;
  let urls = options.swaggerUrls;
  let customOptions = options.customOptions;
  let spec1 = options.swaggerDoc;
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  };
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions);

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth);
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction);
  }

  window.ui = ui;
};
