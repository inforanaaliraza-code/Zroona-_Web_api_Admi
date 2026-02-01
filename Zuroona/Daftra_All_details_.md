    https://docs.daftara.dev/

    Docs
Welcome
This is the official developer portal for Daftra’s RESTful API — a powerful interface to connect with Daftra’s cloud-based business management platform. Whether you're creating new applications, integrating existing systems, or automating internal workflows, Daftra provides flexible and secure tools to extend your capabilities.
Through this API, you can programmatically interact with essential business modules such as:
Invoicing and Billing
Client Management (CRM)
Inventory and Products
Accounting and Expenses
Human Resources
Reporting and more
Who Should Use This Documentation?
This documentation is designed for:
Backend developers looking to integrate Daftra into custom systems
Technology partners building SaaS tools or platform extensions
Businesses automating workflows or syncing data across systems (ERP, e-commerce, etc.)
Key Features of the API
RESTful and JSON-based: Our API is RESTful and JSON-based, using standard HTTP methods (GET, POST, PUT, DELETE) with predictable JSON response structures throughout.
Secure Authentication: Support for API Key and token-based OAuth2 methods
Modular Architecture: Endpoints are grouped logically by modules (Invoices, Clients, Products, etc.)
What You’ll Learn in This Documentation
Authentication Methods
How to use Daftra API Key or request access tokens for secure connections
Endpoint Reference
A complete list of available API endpoints grouped by module with all required parameters and expected responses
Use Case Examples
Implementation examples with clear request/response formats and practical context
Code Snippets
Reusable code samples available in cURL, Python, Node.js, PHP, and more
Error Codes and Handling
Understand and manage common response codes including authentication, validation, and server-side errors
Performance Best Practices
Optimize API usage through pagination, batch processing, and rate handling techniques
Documentation Structure
Section	Description
Authentication	How to authenticate using API Key or token-based method
API Endpoints	Explore endpoints grouped by modules such as Clients, Invoices, Products
Error Handling	Learn about error formats and how to resolve issues efficiently
Code Samples	Ready-to-use examples in multiple programming languages
Rate Limits	Understand daily request limits, throttling, and performance guidelines

==================
# Generate Access Token

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /v2/oauth/token:
    post:
      summary: Generate Access Token
      deprecated: false
      description: ''
      tags:
        - API v1 Endpoints/Auth
      parameters:
        - name: Accept
          in: header
          description: ''
          example: application/json
          schema:
            type: string
            default: application/json
        - name: Content-Type
          in: header
          description: ''
          example: application/json
          schema:
            type: string
        - name: Authorization
          in: header
          description: >-
            You can generate the bearer token using the the authorization
            endpoint then use it here to be able to operate over your account's
            data
          example: Bearer {{access_token}}
          schema:
            type: string
            default: Bearer {{access_token}}
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                client_secret:
                  example: jCfy6cMh1X6NTxR3OWLuvEFa0si5uZKr05UeoAEs
                  type: string
                client_id:
                  example: '1'
                  type: string
                grant_type:
                  example: password
                  type: string
                username:
                  example: '{{username}}'
                  type: string
                password:
                  example: '{{password}}'
                  type: string
              required:
                - client_secret
                - client_id
                - grant_type
                - username
                - password
            examples: {}
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties:
                  token_type:
                    type: string
                  expires_in:
                    type: integer
                  access_token:
                    type: string
                  refresh_token:
                    type: string
                  01JRSR8P77AX0WG65ZHFX3Q0R1:
                    type: string
                required:
                  - 01JRSR8P77AX0WG65ZHFX3Q0R1
                x-apidog-orders:
                  - token_type
                  - expires_in
                  - access_token
                  - refresh_token
                  - 01JRSR8P77AX0WG65ZHFX3Q0R1
              example:
                token_type: Bearer
                expires_in: 94694400
                access_token: >-
                  eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMjA3MzU4MzdkNjdiNWJjYmMzZGRjMTE4NjJiOThjNWE1ZTBkYzdkNWE3ODliNmE3NmI1MjY3MjZiZWU3M2RlYjA5ZWQ1MWRiNzBkZDdmMWQiLCJpYXQiOjE3NDQ2MjA5MjIuMjU4NzM5OSwiZXhwIjoxODM5MzE1MzgyLjI0NjM3Miwic3ViIjoiNDA2MzI3MSIsInNjb3BlcyI6W10sInByb3ZpZGVyIjoib3duZXIiLCJuYmYiOjE3NDQ1MzQ1ODIuMjU4NzU4MX0.QBCnITMq1eIcdr0jx3JkJxU3QzB-PGPCAF0bKLbDOUmQf_o_XGUoEkLTQen75aBM9faIteUrfCwxZ4I8h_LoB-eprQK4Qxg-pbTLOoEixv6WMKTGL_AwCVpuWFoPWbSKVRDb43yFqGoLHuKLBe9-3I2fIjlXguvGbODaECEeL-cJkab6-oqlidiH9dpB-hFqQv1Nsd3uQUxu6C5PJDFyI1si10xy80Hu3jlMX7OS2V8SkFhsq11l2xTgHDDsXf9z4spp3di7dUzoXgFPFoXlp47zGRvc8kNLkr8_Dz3omttPsm82mKZNsCwAatac6Fxw7PJlHjTaTmSukHx9YAd9Nuc6q_AZ_7y2YhvYBj1DhxeVLb-i2BlxXTTJYgjZhqgLvh--4Z5XZCiXv2tagSKggNhNIoKKDftsEDYY8_5fWddMOeRI085yuB5vyrNrnGmv4E8_9VQI43nGuUyVWOFp5EvfQSPB8Db0byG95aSl9ub2d2Akclt3aZ9fWgV3Agxu34x6EQ1YGBrwoHJ_0XvUOWhI3T4_N1lmQapnpVhAEfvyVKccS1jAFO18OvKN-depxYzNIkkbnrxZ9uEsRpsj44oJlSt8QYKKSDn1t9gObkRWLqdmltgayskP4F1Rm2OE-b3FagG_IeKUyua5SFtsi_EU4JP37Kz2yqJWF5yW4R0
                refresh_token: >-
                  def50200fcb939ed9b9d75a0a9193135250cc7efe5248a55c62715c22b0b38fe68c039f2fa1dcdf1d1ea6d45b29729506558341783734dc0360ea6de5190281cd068c5e1a9a5a1c1d540de5c888e7727d6fa46087726ff6566774230a252dce8952c46bbc80100033d01768f6fe6c0b4ca9425f9b5442b0ecb748fcd7d157a52ec2486746723134052e276d760e333bd6177b30cbd0bd744f9aacde79ba65522298e49decc5194e03b683804176f116626cc8897399fa46996e7f5bc2c5946583c8787dcfd6e28f7febc6aa9fea4468b01e2c0d3ee52ff89cf14446a962544a8a58448082c0bb2e9e4bcf007f734a5b68334d1a1bb029402ad11f2c067425e60787ea467ca9547f7de03edbfa74264b362b34fdcef74b7cc383e4cda7a32b080a9dee0be786c62260960e33a87850156fb64ce9bcdb0fbbb0d72475c1268b6e8fb3de85643e6b5e5ef205fa0e3016a37f9408f01ebcfd020d9cb71c147578cd2f8bd4f14b241cf301a
          headers: {}
          x-apidog-name: Success
      security: []
      x-apidog-folder: API v1 Endpoints/Auth
      x-apidog-status: released
      x-run-in-apidog: https://app.apidog.com/web/project/846139/apis/api-15815885-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://{{subdomain}}.daftra.com/api2
    description: Production
  - url: ''
    description: Cloud Mock
  - url: https://{{subdomain}}.daftra.com/v2/api/entity
    description: v2
security: []

```

==============================
# GET All Invoices

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /invoices{format}:
    get:
      summary: GET All Invoices
      deprecated: false
      description: ''
      tags:
        - API v1 Endpoints/Invoices
        - Invoices
      parameters:
        - name: format
          in: path
          description: ''
          required: true
          example: ''
          schema:
            type: string
        - name: limit
          in: query
          description: '20'
          required: false
          schema:
            type: integer
            minimum: 1
            maximum: 1000
            default: 20
        - name: page
          in: query
          description: '1'
          required: false
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: Accept
          in: header
          description: ''
          example: application/json
          schema:
            type: string
            default: application/json
        - name: Content-Type
          in: header
          description: ''
          example: application/json
          schema:
            type: string
        - name: Authorization
          in: header
          description: >-
            You can generate the bearer token using the the authorization
            endpoint then use it here to be able to operate over your account's
            data
          example: Bearer {{access_token}}
          schema:
            type: string
            default: Bearer {{access_token}}
        - name: apikey
          in: header
          description: You can find/generate your apikey(s) from inside your Daftra Account
          example: '{{apikey}}'
          schema:
            type: string
            deprecated: true
            default: '{{apikey}}'
          deprecated: true
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                    examples:
                      - 200
                  result:
                    type: string
                    examples:
                      - successful
                  data:
                    type: array
                    items:
                      type: object
                      properties:
                        Invoice:
                          allOf:
                            - $ref: '#/components/schemas/InvoiceBase'
                            - $ref: '#/components/schemas/Client'
                      x-apidog-orders:
                        - Invoice
                      x-apidog-ignore-properties: []
                  pagination:
                    $ref: '#/components/schemas/Pagination'
                x-apidog-orders:
                  - code
                  - result
                  - data
                  - pagination
                x-apidog-ignore-properties: []
          headers: {}
          x-apidog-name: OK
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: string
                    examples:
                      - failed
                  code:
                    type: integer
                    examples:
                      - 401
                  message:
                    type: string
                    examples:
                      - Unauthorized
                x-apidog-orders:
                  - result
                  - code
                  - message
                x-apidog-ignore-properties: []
          headers: {}
          x-apidog-name: Unauthorized
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: string
                    examples:
                      - failed
                  code:
                    type: integer
                    examples:
                      - 403
                  message:
                    type: string
                    examples:
                      - Forbidden
                x-apidog-orders:
                  - result
                  - code
                  - message
                x-apidog-ignore-properties: []
          headers: {}
          x-apidog-name: Forbidden
      security: []
      x-apidog-folder: API v1 Endpoints/Invoices
      x-apidog-status: released
      x-run-in-apidog: https://app.apidog.com/web/project/846139/apis/api-15115241-run
components:
  schemas:
    Pagination:
      type: object
      properties:
        prev:
          type: string
          examples:
            - /api2/clients/?page=1
          nullable: true
        next:
          type: string
          examples:
            - /api2/clients/?page=3
          nullable: true
        page:
          type: integer
          examples:
            - 2
        page_count:
          type: integer
          examples:
            - 5
        total_results:
          type: integer
          examples:
            - 98
      x-apidog-orders:
        - prev
        - next
        - page
        - page_count
        - total_results
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
    Client:
      type: object
      properties:
        Client:
          $ref: '#/components/schemas/ClientBase'
      x-apidog-orders:
        - Client
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
    ClientBase:
      type: object
      properties:
        id:
          type: integer
          format: int32
          description: Primary Key
          readOnly: true
          examples:
            - 512
        is_offline:
          type: boolean
          description: 0 / 1 indicates if the Client is offline
        client_number:
          type: string
          description: Visual identifier for the Client
          examples:
            - '0000715'
        staff_id:
          type: integer
          format: int64
          description: >-
            Staff ID who created the invoice get it from [GET STAFF
            API](/15115376e0) if it's `0` that means the site owner is the staff
            that created it
          default: 0
          examples:
            - 0
        business_name:
          type: string
          maxLength: 100
          description: Client's business name
          examples:
            - John Smith
        first_name:
          type: string
          maxLength: 255
          description: Client's first name
          examples:
            - ''
        last_name:
          type: string
          maxLength: 255
          description: Client's last name
          examples:
            - ''
        email:
          type: string
          format: email
          maxLength: 255
          description: Client's email
        password:
          type: string
          maxLength: 255
          description: Client's password
          writeOnly: true
        address1:
          type: string
          maxLength: 255
          description: Client's Address line 1
        address2:
          type: string
          maxLength: 255
          description: Client's Address line 2
        city:
          type: string
          maxLength: 100
          description: Client's City
        state:
          type: string
          maxLength: 100
          description: Client's State
        postal_code:
          type: string
          maxLength: 20
          description: Client's postal code
        phone1:
          type: string
          maxLength: 50
          description: Client's phone number
        phone2:
          type: string
          maxLength: 50
          description: Client's mobile number
        country_code:
          type: string
          maxLength: 3
          description: Client's country ISO "ALPHA-2 Code
        notes:
          type: string
          description: Notes for the Client
        active_secondary_address:
          type: boolean
          description: 0/1 if the secondary data is active.
        secondary_name:
          type: string
          maxLength: 255
          description: Client's name
        secondary_address1:
          type: string
          maxLength: 255
          description: Client's address line 1
        secondary_address2:
          type: string
          maxLength: 255
          description: Client's address line 2
        secondary_city:
          type: string
          maxLength: 100
          description: Client's City
        secondary_state:
          type: string
          maxLength: 100
          description: Client's State
        secondary_postal_code:
          type: string
          maxLength: 50
          description: Client's postal code
        secondary_country_code:
          type: string
          maxLength: 10
          description: Client's country ISO "ALPHA-2 Code
        default_currency_code:
          type: string
          maxLength: 5
          description: 3 Digit currency code following ISO 4217 standard
        last_login:
          type: string
          format: date-time
          description: Time of the lsat successful login for the Client
          readOnly: true
          examples:
            - '2018-05-10 00:42:00'
        suspend:
          type: boolean
          description: 0/1 indicating if the account is suspended.
          readOnly: true
        last_ip:
          type: string
          description: the last ip of the device where the client logged in from
          readOnly: true
          examples:
            - 127.0.0.1
        created:
          type: string
          format: date-time
          description: Time of creation for the Client
          readOnly: true
          examples:
            - '2018-05-10 00:42:00'
        modified:
          type: string
          format: date-time
          description: Last Time this Client was updated
          readOnly: true
          examples:
            - '2018-05-12 13:05:06'
        follow_up_status:
          type: integer
          description: >-
            Follow Up Status get it from [GET Follow up statuses with model
            client](/15115383e0)
          default: null
          nullable: true
        category:
          type: string
          description: label for the client
        group_price_id:
          type: integer
          format: int32
          description: >-
            Group price Ref get it from [GET General Listing API with model
            `GroupPrice`](/15115384e0)
        timezone:
          type: integer
          format: int32
          description: >-
            Timezone id get it from [GET General Listing API with model
            `Timezone`](/15115384e0)
        bn1:
          type: string
          description: value for the bn1
        bn1_label:
          type: string
          description: >-
            label for the bn1 depends on the country like `Tax ID number` OR
            `Business number`
        bn2_label:
          type: string
          description: >-
            label for the bn2 depends on the country like `Tax ID number` OR
            `Business number`
        bn2:
          type: string
          description: value for the bn2
        starting_balance:
          type: double
          description: starting balance of the client
          default: null
          nullable: true
        type:
          type: integer
          description: client type
          enum:
            - 2 => 'Individual'
            - 3 => 'Business'
          default: null
          examples:
            - 2
          nullable: true
        birth_date:
          type: string
          format: date
          description: client's birth date
          examples:
            - '2018-05-10'
        gender:
          type: integer
          description: client gender
          enum:
            - null => 'Not selected'
            - 0 => 'Not selected'
            - 1 => 'Male'
            - 2 => 'Female'
          default: null
          examples:
            - 2
          nullable: true
        map_location:
          type: string
          description: client's map location (latitude,longitude,zoom)
          default: null
          examples:
            - 31.287550225000018,30.075630726558106,5
          nullable: true
        credit_limit:
          type: string
          description: client's credit limit
          default: 0
        credit_period:
          type: string
          description: client's credit period in days
          default: 0
      required:
        - business_name
        - first_name
        - last_name
        - email
        - password
        - type
      x-apidog-orders:
        - id
        - is_offline
        - client_number
        - staff_id
        - business_name
        - first_name
        - last_name
        - email
        - password
        - address1
        - address2
        - city
        - state
        - postal_code
        - phone1
        - phone2
        - country_code
        - notes
        - active_secondary_address
        - secondary_name
        - secondary_address1
        - secondary_address2
        - secondary_city
        - secondary_state
        - secondary_postal_code
        - secondary_country_code
        - default_currency_code
        - last_login
        - suspend
        - last_ip
        - created
        - modified
        - follow_up_status
        - category
        - group_price_id
        - timezone
        - bn1
        - bn1_label
        - bn2_label
        - bn2
        - starting_balance
        - type
        - birth_date
        - gender
        - map_location
        - credit_limit
        - credit_period
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
    InvoiceBase:
      type: object
      properties:
        id:
          type: integer
          format: int64
          description: Unique identifier
          readOnly: true
          examples:
            - 26
        staff_id:
          type: integer
          format: int64
          description: >-
            Staff ID who created the invoice get it from [GET STAFF
            API](/15115376e0) if it's `0` that means the site owner is the staff
            that created it
          default: 0
          examples:
            - 0
        subscription_id:
          type: integer
          format: int64
          description: >-
            Invoice id which this invoice follows so when adding refund this
            field indicates which invoice is being refunded get the invoice ids
            from [GET All Invoices API](/15115241e0) when this field is set to
            `null` that means that this invoice isn't a child of any invoice
          default: null
          examples:
            - 26
          nullable: true
        store_id:
          type: integer
          format: int64
          description: >-
            The store which this invoice uses get it from [GET STORE
            API](/15115366e0)
          examples:
            - 0
        type:
          type: integer
          format: int64
          description: invoice type
          enum:
            - 0 => Invoice
            - 2 => Subscription
            - 3 => Estimate
            - 5 => Credit Note
            - 6 => Refund Receipt
            - 7 => BNR
            - 8 => Booking
          readOnly: true
          examples:
            - 0
        'no':
          type: string
          maxLength: '255'
          description: Invoice number, this field is auto generated but can be overridden
          examples:
            - 0700000AAAAA0001
          nullable: true
        po_number:
          type: string
          maxLength: '255'
          description: Purchase invoice number
          examples:
            - 26
          nullable: true
        name:
          type: string
          maxLength: '255'
          description: used in template and subscription only
          nullable: true
        client_id:
          type: integer
          format: int64
          description: The client id get it from [GET Client API](/15115261e0)
          examples:
            - 15
        is_offline:
          type: boolean
          description: '!! 0 / 1 indicates if the client is offline'
        currency_code:
          type: string
          maxLength: '10'
          description: Currency Code
          examples:
            - USD
        client_business_name:
          type: string
          maxLength: '100'
          description: Client's business name
          examples:
            - Example Client
        client_first_name:
          type: string
          maxLength: '255'
          description: Client's first name
          examples:
            - Example
        client_last_name:
          type: string
          maxLength: '255'
          description: Client's last name
          examples:
            - Client
        client_email:
          type: string
          format: email
          maxLength: '255'
          description: Client's email
          examples:
            - client@example.com
        client_address1:
          type: string
          maxLength: '255'
          description: Client's Address line 1
        client_address2:
          type: string
          maxLength: '255'
          description: Client's Address line 2
        client_postal_code:
          type: string
          maxLength: '20'
          description: Client's postal code
        client_city:
          type: string
          maxLength: '100'
          description: Client's City
        client_state:
          type: string
          maxLength: '100'
          description: Client's State
        client_country_code:
          type: string
          maxLength: '3'
          description: Client's country ISO "ALPHA-2" Code
          examples:
            - EG
        date:
          type: string
          format: date
          description: the date of the invoice
          examples:
            - '2018-11-07'
        payment_status:
          type: integer
          description: >-
            payment status, on adding invoice this field is set automatically
            via invoice payments
          enum:
            - null => Unpaid
            - ''''' => Unpaid'
            - 0 => Unpaid
            - 1 => Partially Paid
            - 2 => Paid
            - 3 => Refunded
            - 4 => OverPaid
            - '-1 => Draft'
          readOnly: true
          examples:
            - 0
          nullable: true
        draft:
          type: boolean
          description: '[0 => not draft,1 => draft]'
          examples:
            - '0'
        discount:
          type: double
          description: >-
            discount percentage of the invoice ```note that this field alternate
            with `discount_amount```` example to set 5% discount is set this
            field to 5 and `discount_amount` field to 0
          default: 0
        discount_amount:
          type: double
          description: >-
            absolute discount of the invoice ```note that this field alternate
            with `discount```` example to set 5 USD discount is set this field
            to 5 and `discount` field to 0
          default: 0
        deposit:
          type: double
          description: Deposit amount
          default: 0
        deposit_type:
          type: integer
          description: Deposit Type
          enum:
            - 0 => Unpaid
            - 1 => Unpaid
            - 2 => Paid
          default: 0
        summary_subtotal:
          type: double
          description: total invoice without taxes
          default: 0
          readOnly: true
        summary_discount:
          type: double
          description: total discount applied on the invoice
          default: 0
          readOnly: true
        summary_total:
          type: double
          description: total invoice with taxes
          default: 0
          readOnly: true
        summary_paid:
          type: double
          description: total paid amount
          default: 0
          readOnly: true
        summary_unpaid:
          type: double
          description: total unpaid amount
          default: 0
          readOnly: true
        summary_deposit:
          type: double
          description: total deposited amount
          default: 0
          readOnly: true
        summary_refund:
          type: double
          description: total refunded amount
          default: 0
          readOnly: true
        notes:
          type: string
          description: Notes for the client
        html_notes:
          type: string
          description: html template notes
        created:
          type: date-time
          description: the date when the invoice was created
          readOnly: true
          examples:
            - '2018-11-07'
        modified:
          type: date-time
          description: the last date when the invoice was modified
          readOnly: true
          examples:
            - '2018-11-07'
        invoice_layout_id:
          type: integer
          format: int64
          description: >-
            the layout for viewing this invoice get it from [GET General Listing
            API with model `InvoiceLayout`](/15115384e0) if not set the default
            layout is used
          examples:
            - 1
          nullable: true
        estimate_id:
          type: integer
          format: int64
          description: >-
            The estimate of this invoice get it from [GET Estimates
            API](/15115246e0) if it's not set the primary store is used
          default: The primary store id
          examples:
            - 0
        shipping_options:
          type: integer
          description: Deposit Type
          enum:
            - ''''' => Auto'
            - 1 => Don't show shipping options
            - 2 => Show the main client details
            - 3 => Show secondary client details
          default: ''
        shipping_amount:
          type: double
          description: Deposit amount
          default: null
          nullable: true
        client_active_secondary_address:
          type: boolean
          description: 0/1 if the secondary data is active
        client_secondary_name:
          type: string
          maxLength: '255'
          description: Supplier's name
        client_secondary_address1:
          type: string
          maxLength: '255'
          description: Client's address line 1
        client_secondary_address2:
          type: string
          maxLength: '255'
          description: Client's address line 2
        client_secondary_city:
          type: string
          maxLength: '100'
          description: Client's City
        client_secondary_state:
          type: string
          maxLength: '100'
          description: Client's State
        client_secondary_postal_code:
          type: string
          maxLength: '50'
          description: Client's postal code
        client_secondary_country_code:
          type: string
          maxLength: '10'
          description: Client's country ISO "ALPHA-2" Code
        follow_up_status:
          type: integer
          description: >-
            Follow Up Status get it from [GET Follow up statuses with model
            invoice](/15115383e0)
          default: null
          nullable: true
        work_order_id:
          type: integer
          description: Work Order ID get it from [GET Work orders](/15115271e0)
          default: null
          nullable: true
        requisition_delivery_status:
          type: integer
          description: Requisition delivery Status
          enum:
            - 1 => Pending
            - 2 => Not All Available
            - 3 => Accepted
            - 4 => Cancelled
            - 5 => Modified
          default: null
          nullable: true
        pos_shift_id:
          type: integer
          description: POS session id
          default: null
          nullable: true
        source_type:
          type: integer
          description: >-
            Source type that created the invoice if it's `null` then this means
            the invoice has no source
          enum:
            - 0 => Invoice
            - 2 => Subscription
            - 3 => Estimate
            - 5 => Credit Note
            - 6 => Refund Receipt
            - 7 => BNR
            - 8 => Booking
          default: null
          readOnly: true
          nullable: true
        source_id:
          type: integer
          description: source item id that created the invoice
          default: null
          readOnly: true
          nullable: true
        qr_code_url:
          type: string
          description: >-
            direct url for the QR Code image of that invoice for KSA Electronic
            Invoice only
          examples:
            - >-
              https://yoursite.daftra.com/qr/?d64=QVE1TmIyaGhiV1ZrSUVGemFISmhaZ0lJTVRFMU16WTJRMUlERkRJd01qSXRNVEF0TWpoVU1EQTZNREU2TVRWYUJBRXdCUUV3
        invoice_html_url:
          type: string
          description: direct url that will return HTML code of the invoice
          examples:
            - >-
              https://yoursite.daftra.com/invoices/preview/2621?hash=c06543fe13bd4850b521733687c53259
        invoice_pdf_url:
          type: string
          description: direct url to download pdf version of the invoice
          examples:
            - >-
              https://yoursite.daftra.com/invoices/view/2621.pdf?hash=c06543fe13bd4850b521733687c53259
      required:
        - store_id
        - client_id
      x-apidog-orders:
        - id
        - staff_id
        - subscription_id
        - store_id
        - type
        - 'no'
        - po_number
        - name
        - client_id
        - is_offline
        - currency_code
        - client_business_name
        - client_first_name
        - client_last_name
        - client_email
        - client_address1
        - client_address2
        - client_postal_code
        - client_city
        - client_state
        - client_country_code
        - date
        - payment_status
        - draft
        - discount
        - discount_amount
        - deposit
        - deposit_type
        - summary_subtotal
        - summary_discount
        - summary_total
        - summary_paid
        - summary_unpaid
        - summary_deposit
        - summary_refund
        - notes
        - html_notes
        - created
        - modified
        - invoice_layout_id
        - estimate_id
        - shipping_options
        - shipping_amount
        - client_active_secondary_address
        - client_secondary_name
        - client_secondary_address1
        - client_secondary_address2
        - client_secondary_city
        - client_secondary_state
        - client_secondary_postal_code
        - client_secondary_country_code
        - follow_up_status
        - work_order_id
        - requisition_delivery_status
        - pos_shift_id
        - source_type
        - source_id
        - qr_code_url
        - invoice_html_url
        - invoice_pdf_url
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
  securitySchemes: {}
servers:
  - url: https://{{subdomain}}.daftra.com/api2
    description: Production
  - url: ''
    description: Cloud Mock
  - url: https://{{subdomain}}.daftra.com/v2/api/entity
    description: v2
security: []

```
==================
# GET Single Invoice

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /invoices/{id}{format}:
    get:
      summary: GET Single Invoice
      deprecated: false
      description: ''
      tags:
        - API v1 Endpoints/Invoices
        - Invoices
      parameters:
        - name: id
          in: path
          description: ''
          required: true
          example: ''
          schema:
            type: string
        - name: format
          in: path
          description: ''
          required: true
          example: ''
          schema:
            type: string
        - name: Accept
          in: header
          description: ''
          example: application/json
          schema:
            type: string
            default: application/json
        - name: Content-Type
          in: header
          description: ''
          example: application/json
          schema:
            type: string
        - name: Authorization
          in: header
          description: >-
            You can generate the bearer token using the the authorization
            endpoint then use it here to be able to operate over your account's
            data
          example: Bearer {{access_token}}
          schema:
            type: string
            default: Bearer {{access_token}}
        - name: apikey
          in: header
          description: You can find/generate your apikey(s) from inside your Daftra Account
          example: '{{apikey}}'
          schema:
            type: string
            deprecated: true
            default: '{{apikey}}'
          deprecated: true
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                    examples:
                      - 200
                  result:
                    type: string
                    examples:
                      - successful
                  data:
                    type: object
                    properties:
                      Invoice:
                        allOf:
                          - $ref: '#/components/schemas/InvoiceBase'
                          - $ref: '#/components/schemas/Client'
                          - $ref: '#/components/schemas/InvoiceItemRef'
                          - $ref: '#/components/schemas/InvoicePaymentRef'
                          - $ref: '#/components/schemas/InvoiceCustomField'
                          - $ref: '#/components/schemas/Deposit'
                          - $ref: '#/components/schemas/InvoiceReminder'
                          - $ref: '#/components/schemas/Document'
                          - $ref: '#/components/schemas/DocumentTitle'
                    x-apidog-orders:
                      - Invoice
                    x-apidog-ignore-properties: []
                  pagination:
                    $ref: '#/components/schemas/Pagination'
                x-apidog-orders:
                  - code
                  - result
                  - data
                  - pagination
                x-apidog-ignore-properties: []
          headers: {}
          x-apidog-name: OK
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: string
                    examples:
                      - failed
                  code:
                    type: integer
                    examples:
                      - 401
                  message:
                    type: string
                    examples:
                      - Unauthorized
                x-apidog-orders:
                  - result
                  - code
                  - message
                x-apidog-ignore-properties: []
          headers: {}
          x-apidog-name: Unauthorized
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: string
                    examples:
                      - failed
                  code:
                    type: integer
                    examples:
                      - 403
                  message:
                    type: string
                    examples:
                      - Forbidden
                x-apidog-orders:
                  - result
                  - code
                  - message
                x-apidog-ignore-properties: []
          headers: {}
          x-apidog-name: Forbidden
        '404':
          description: NotFound
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: string
                    examples:
                      - failed
                  code:
                    type: integer
                    examples:
                      - 404
                  message:
                    type: string
                    examples:
                      - Item not found
                x-apidog-orders:
                  - result
                  - code
                  - message
                x-apidog-ignore-properties: []
          headers: {}
          x-apidog-name: Record Not Found
      security: []
      x-apidog-folder: API v1 Endpoints/Invoices
      x-apidog-status: released
      x-run-in-apidog: https://app.apidog.com/web/project/846139/apis/api-15115238-run
components:
  schemas:
    Pagination:
      type: object
      properties:
        prev:
          type: string
          examples:
            - /api2/clients/?page=1
          nullable: true
        next:
          type: string
          examples:
            - /api2/clients/?page=3
          nullable: true
        page:
          type: integer
          examples:
            - 2
        page_count:
          type: integer
          examples:
            - 5
        total_results:
          type: integer
          examples:
            - 98
      x-apidog-orders:
        - prev
        - next
        - page
        - page_count
        - total_results
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
    DocumentTitle:
      type: object
      properties:
        DocumentTitle:
          type: object
          x-apidog-orders: []
          properties: {}
          x-apidog-ignore-properties: []
      x-apidog-orders:
        - DocumentTitle
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
    Document:
      type: object
      properties:
        Document:
          type: object
          x-apidog-orders: []
          properties: {}
          x-apidog-ignore-properties: []
      x-apidog-orders:
        - Document
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
    InvoiceReminder:
      type: object
      properties:
        InvoiceReminder:
          type: object
          x-apidog-orders: []
          properties: {}
          x-apidog-ignore-properties: []
      x-apidog-orders:
        - InvoiceReminder
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
    Deposit:
      type: object
      properties:
        Deposit:
          type: object
          x-apidog-orders: []
          properties: {}
          x-apidog-ignore-properties: []
      x-apidog-orders:
        - Deposit
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
    InvoiceCustomField:
      type: object
      properties:
        InvoiceCustomField:
          type: object
          x-apidog-orders: []
          properties: {}
          x-apidog-ignore-properties: []
      x-apidog-orders:
        - InvoiceCustomField
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
    InvoicePaymentRef:
      type: object
      properties:
        InvoicePayment:
          type: array
          items:
            $ref: '#/components/schemas/PaymentBase'
      x-apidog-orders:
        - InvoicePayment
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
    PaymentBase:
      type: object
      properties:
        id:
          type: integer
          format: int64
          description: Unique identifier
          readOnly: true
        invoice_id:
          type: integer
          format: int64
          description: Invoice REF#, you can get it through the Invoices API
        payment_method:
          type: string
          maxLength: '100'
          description: Method of payment
        amount:
          type: number
          format: double
          description: Amount paid
        transaction_id:
          type: string
          maxLength: '100'
          description: Visual identifier for the process
        treasury_id:
          type: integer
          maxLength: '100'
          description: Treasury Ref get it from [GET Treasuries](/15115371e0)
        date:
          type: string
          format: date-time
          description: date of the payment
        email:
          type: string
          maxLength: '255'
          description: Optional Email
        status:
          type: integer
          format: int32
          description: >-
            Status of the payment 0=>failded, 1=>completed , 2=>pending, 3=>not
            completed
        notes:
          type: string
          description: Notes for payment
        response_code:
          type: string
          description: Response code of the API called ex:(stripe , paypal , .. )
        response_message:
          type: string
          description: Response message of the API called ex:(stripe , paypal , .. )
        created:
          type: string
          format: date-time
          description: Time of creation for the client
        modified:
          type: string
          format: date-time
          description: Last Time this Payment was updated
        currency_code:
          type: string
          maxLength: '3'
          description: 3 Digit currency code following ISO 4217 standard
        first_name:
          type: string
          maxLength: '255'
          description: First Name (Extra Info)
        last_name:
          type: string
          maxLength: '255'
          description: Last name (Extra Info)
        address1:
          type: string
          maxLength: '255'
          description: Address line 1 (Extra Info)
        address2:
          type: string
          maxLength: '255'
          description: Address line 2 (Extra Info)
        city:
          type: string
          maxLength: '255'
          description: City (Extra Info)
        state:
          type: string
          maxLength: '100'
          description: State (Extra Info)
        postal_code:
          type: string
          maxLength: '10'
          description: Postal code (Extra Info)
        country_code:
          type: string
          maxLength: '3'
          description: Country ISO "ALPHA-2" Code (Extra Info)
        phone1:
          type: string
          maxLength: '50'
          description: Phone number (Extra Info)
        phone2:
          type: string
          maxLength: '50'
          description: Mobile number (Extra Info)
        transaction_type:
          type: string
          maxLength: '255'
          description: '!!'
        processed:
          type: boolean
          description: 0/1 if the payment is processed
        attachment:
          type: string
          maxLength: '255'
          description: Link for the attachment
        staff_id:
          type: integer
          format: int32
          description: >-
            Staff user submitting the request get it from [GET STAFF
            API](/15115376e0) if it's `0` that means the site owner is the staff
            that created it
        receipt_notes:
          type: string
          description: 'Notes for the receipt . '
      required:
        - invoice_id
        - payment_method
        - amount
      x-apidog-orders:
        - id
        - invoice_id
        - payment_method
        - amount
        - transaction_id
        - treasury_id
        - date
        - email
        - status
        - notes
        - response_code
        - response_message
        - created
        - modified
        - currency_code
        - first_name
        - last_name
        - address1
        - address2
        - city
        - state
        - postal_code
        - country_code
        - phone1
        - phone2
        - transaction_type
        - processed
        - attachment
        - staff_id
        - receipt_notes
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
    InvoiceItemRef:
      type: object
      properties:
        InvoiceItem:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
                description: Invoice Item ID
                readOnly: true
              invoice_id:
                type: integer
                description: 'Invoice Ref #'
              item:
                type: string
                description: Name of the product
              description:
                type: string
                description: Description of the item
              unit_price:
                type: number
                format: double
                description: Unit price of the item
              quantity:
                type: integer
                format: int32
                description: Quantity of the item in the order
              tax1:
                type: integer
                description: >-
                  Tax 1 id applied on this item get if from [GET
                  Taxes](/15115346e0)
              tax2:
                type: integer
                description: >-
                  Tax 2 id applied on this item get if from [GET
                  Taxes](/15115346e0)
              summary_tax1:
                type: number
                format: double
                description: Tax 1 calculated amount applied on this item
                readOnly: true
              summary_tax2:
                type: number
                format: double
                description: Tax 2 calculated amount applied on this item
                readOnly: true
              subtotal:
                type: number
                format: double
                description: total price of the product without taxes
                readOnly: true
              product_id:
                type: integer
                format: int32
                description: 'Product Ref # get it from [GET Products](/15115316e0)'
              col_3:
                type: string
                description: additional data to be appear in the invoice layout
                default: null
                nullable: true
              col_4:
                type: string
                description: additional data to be appear in the invoice layout
                default: null
                nullable: true
              col_5:
                type: string
                description: additional data to be appear in the invoice layout
                default: null
                nullable: true
              created:
                type: string
                format: date-time
                description: Time of creation for this item
                readOnly: true
                examples:
                  - '2018-05-10 00:42:00'
              modified:
                type: string
                format: date-time
                description: Last Time this item was updated
                readOnly: true
                examples:
                  - '2018-05-12 13:05:06'
              discount:
                type: number
                format: double
                description: discount amount
              discount_type:
                type: integer
                description: discount type
                enum:
                  - 1 => Percentage
                  - 2 => Absolute
              store_id:
                type: integer
                format: int64
                description: >-
                  The store which this item belongs to get it from [GET STORE
                  API](/15115366e0) if it's not set the invoice store is used
                default: The invoice store id
                examples:
                  - 0
              calculated_discount:
                type: number
                format: double
                description: total applied discount on this item
                readOnly: true
            required:
              - invoice_id
              - unit_price
              - quantity
              - product_id
            x-apidog-orders:
              - id
              - invoice_id
              - item
              - description
              - unit_price
              - quantity
              - tax1
              - tax2
              - summary_tax1
              - summary_tax2
              - subtotal
              - product_id
              - col_3
              - col_4
              - col_5
              - created
              - modified
              - discount
              - discount_type
              - store_id
              - calculated_discount
            x-apidog-ignore-properties: []
      x-apidog-orders:
        - InvoiceItem
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
    Client:
      type: object
      properties:
        Client:
          $ref: '#/components/schemas/ClientBase'
      x-apidog-orders:
        - Client
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
    ClientBase:
      type: object
      properties:
        id:
          type: integer
          format: int32
          description: Primary Key
          readOnly: true
          examples:
            - 512
        is_offline:
          type: boolean
          description: 0 / 1 indicates if the Client is offline
        client_number:
          type: string
          description: Visual identifier for the Client
          examples:
            - '0000715'
        staff_id:
          type: integer
          format: int64
          description: >-
            Staff ID who created the invoice get it from [GET STAFF
            API](/15115376e0) if it's `0` that means the site owner is the staff
            that created it
          default: 0
          examples:
            - 0
        business_name:
          type: string
          maxLength: 100
          description: Client's business name
          examples:
            - John Smith
        first_name:
          type: string
          maxLength: 255
          description: Client's first name
          examples:
            - ''
        last_name:
          type: string
          maxLength: 255
          description: Client's last name
          examples:
            - ''
        email:
          type: string
          format: email
          maxLength: 255
          description: Client's email
        password:
          type: string
          maxLength: 255
          description: Client's password
          writeOnly: true
        address1:
          type: string
          maxLength: 255
          description: Client's Address line 1
        address2:
          type: string
          maxLength: 255
          description: Client's Address line 2
        city:
          type: string
          maxLength: 100
          description: Client's City
        state:
          type: string
          maxLength: 100
          description: Client's State
        postal_code:
          type: string
          maxLength: 20
          description: Client's postal code
        phone1:
          type: string
          maxLength: 50
          description: Client's phone number
        phone2:
          type: string
          maxLength: 50
          description: Client's mobile number
        country_code:
          type: string
          maxLength: 3
          description: Client's country ISO "ALPHA-2 Code
        notes:
          type: string
          description: Notes for the Client
        active_secondary_address:
          type: boolean
          description: 0/1 if the secondary data is active.
        secondary_name:
          type: string
          maxLength: 255
          description: Client's name
        secondary_address1:
          type: string
          maxLength: 255
          description: Client's address line 1
        secondary_address2:
          type: string
          maxLength: 255
          description: Client's address line 2
        secondary_city:
          type: string
          maxLength: 100
          description: Client's City
        secondary_state:
          type: string
          maxLength: 100
          description: Client's State
        secondary_postal_code:
          type: string
          maxLength: 50
          description: Client's postal code
        secondary_country_code:
          type: string
          maxLength: 10
          description: Client's country ISO "ALPHA-2 Code
        default_currency_code:
          type: string
          maxLength: 5
          description: 3 Digit currency code following ISO 4217 standard
        last_login:
          type: string
          format: date-time
          description: Time of the lsat successful login for the Client
          readOnly: true
          examples:
            - '2018-05-10 00:42:00'
        suspend:
          type: boolean
          description: 0/1 indicating if the account is suspended.
          readOnly: true
        last_ip:
          type: string
          description: the last ip of the device where the client logged in from
          readOnly: true
          examples:
            - 127.0.0.1
        created:
          type: string
          format: date-time
          description: Time of creation for the Client
          readOnly: true
          examples:
            - '2018-05-10 00:42:00'
        modified:
          type: string
          format: date-time
          description: Last Time this Client was updated
          readOnly: true
          examples:
            - '2018-05-12 13:05:06'
        follow_up_status:
          type: integer
          description: >-
            Follow Up Status get it from [GET Follow up statuses with model
            client](/15115383e0)
          default: null
          nullable: true
        category:
          type: string
          description: label for the client
        group_price_id:
          type: integer
          format: int32
          description: >-
            Group price Ref get it from [GET General Listing API with model
            `GroupPrice`](/15115384e0)
        timezone:
          type: integer
          format: int32
          description: >-
            Timezone id get it from [GET General Listing API with model
            `Timezone`](/15115384e0)
        bn1:
          type: string
          description: value for the bn1
        bn1_label:
          type: string
          description: >-
            label for the bn1 depends on the country like `Tax ID number` OR
            `Business number`
        bn2_label:
          type: string
          description: >-
            label for the bn2 depends on the country like `Tax ID number` OR
            `Business number`
        bn2:
          type: string
          description: value for the bn2
        starting_balance:
          type: double
          description: starting balance of the client
          default: null
          nullable: true
        type:
          type: integer
          description: client type
          enum:
            - 2 => 'Individual'
            - 3 => 'Business'
          default: null
          examples:
            - 2
          nullable: true
        birth_date:
          type: string
          format: date
          description: client's birth date
          examples:
            - '2018-05-10'
        gender:
          type: integer
          description: client gender
          enum:
            - null => 'Not selected'
            - 0 => 'Not selected'
            - 1 => 'Male'
            - 2 => 'Female'
          default: null
          examples:
            - 2
          nullable: true
        map_location:
          type: string
          description: client's map location (latitude,longitude,zoom)
          default: null
          examples:
            - 31.287550225000018,30.075630726558106,5
          nullable: true
        credit_limit:
          type: string
          description: client's credit limit
          default: 0
        credit_period:
          type: string
          description: client's credit period in days
          default: 0
      required:
        - business_name
        - first_name
        - last_name
        - email
        - password
        - type
      x-apidog-orders:
        - id
        - is_offline
        - client_number
        - staff_id
        - business_name
        - first_name
        - last_name
        - email
        - password
        - address1
        - address2
        - city
        - state
        - postal_code
        - phone1
        - phone2
        - country_code
        - notes
        - active_secondary_address
        - secondary_name
        - secondary_address1
        - secondary_address2
        - secondary_city
        - secondary_state
        - secondary_postal_code
        - secondary_country_code
        - default_currency_code
        - last_login
        - suspend
        - last_ip
        - created
        - modified
        - follow_up_status
        - category
        - group_price_id
        - timezone
        - bn1
        - bn1_label
        - bn2_label
        - bn2
        - starting_balance
        - type
        - birth_date
        - gender
        - map_location
        - credit_limit
        - credit_period
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
    InvoiceBase:
      type: object
      properties:
        id:
          type: integer
          format: int64
          description: Unique identifier
          readOnly: true
          examples:
            - 26
        staff_id:
          type: integer
          format: int64
          description: >-
            Staff ID who created the invoice get it from [GET STAFF
            API](/15115376e0) if it's `0` that means the site owner is the staff
            that created it
          default: 0
          examples:
            - 0
        subscription_id:
          type: integer
          format: int64
          description: >-
            Invoice id which this invoice follows so when adding refund this
            field indicates which invoice is being refunded get the invoice ids
            from [GET All Invoices API](/15115241e0) when this field is set to
            `null` that means that this invoice isn't a child of any invoice
          default: null
          examples:
            - 26
          nullable: true
        store_id:
          type: integer
          format: int64
          description: >-
            The store which this invoice uses get it from [GET STORE
            API](/15115366e0)
          examples:
            - 0
        type:
          type: integer
          format: int64
          description: invoice type
          enum:
            - 0 => Invoice
            - 2 => Subscription
            - 3 => Estimate
            - 5 => Credit Note
            - 6 => Refund Receipt
            - 7 => BNR
            - 8 => Booking
          readOnly: true
          examples:
            - 0
        'no':
          type: string
          maxLength: '255'
          description: Invoice number, this field is auto generated but can be overridden
          examples:
            - 0700000AAAAA0001
          nullable: true
        po_number:
          type: string
          maxLength: '255'
          description: Purchase invoice number
          examples:
            - 26
          nullable: true
        name:
          type: string
          maxLength: '255'
          description: used in template and subscription only
          nullable: true
        client_id:
          type: integer
          format: int64
          description: The client id get it from [GET Client API](/15115261e0)
          examples:
            - 15
        is_offline:
          type: boolean
          description: '!! 0 / 1 indicates if the client is offline'
        currency_code:
          type: string
          maxLength: '10'
          description: Currency Code
          examples:
            - USD
        client_business_name:
          type: string
          maxLength: '100'
          description: Client's business name
          examples:
            - Example Client
        client_first_name:
          type: string
          maxLength: '255'
          description: Client's first name
          examples:
            - Example
        client_last_name:
          type: string
          maxLength: '255'
          description: Client's last name
          examples:
            - Client
        client_email:
          type: string
          format: email
          maxLength: '255'
          description: Client's email
          examples:
            - client@example.com
        client_address1:
          type: string
          maxLength: '255'
          description: Client's Address line 1
        client_address2:
          type: string
          maxLength: '255'
          description: Client's Address line 2
        client_postal_code:
          type: string
          maxLength: '20'
          description: Client's postal code
        client_city:
          type: string
          maxLength: '100'
          description: Client's City
        client_state:
          type: string
          maxLength: '100'
          description: Client's State
        client_country_code:
          type: string
          maxLength: '3'
          description: Client's country ISO "ALPHA-2" Code
          examples:
            - EG
        date:
          type: string
          format: date
          description: the date of the invoice
          examples:
            - '2018-11-07'
        payment_status:
          type: integer
          description: >-
            payment status, on adding invoice this field is set automatically
            via invoice payments
          enum:
            - null => Unpaid
            - ''''' => Unpaid'
            - 0 => Unpaid
            - 1 => Partially Paid
            - 2 => Paid
            - 3 => Refunded
            - 4 => OverPaid
            - '-1 => Draft'
          readOnly: true
          examples:
            - 0
          nullable: true
        draft:
          type: boolean
          description: '[0 => not draft,1 => draft]'
          examples:
            - '0'
        discount:
          type: double
          description: >-
            discount percentage of the invoice ```note that this field alternate
            with `discount_amount```` example to set 5% discount is set this
            field to 5 and `discount_amount` field to 0
          default: 0
        discount_amount:
          type: double
          description: >-
            absolute discount of the invoice ```note that this field alternate
            with `discount```` example to set 5 USD discount is set this field
            to 5 and `discount` field to 0
          default: 0
        deposit:
          type: double
          description: Deposit amount
          default: 0
        deposit_type:
          type: integer
          description: Deposit Type
          enum:
            - 0 => Unpaid
            - 1 => Unpaid
            - 2 => Paid
          default: 0
        summary_subtotal:
          type: double
          description: total invoice without taxes
          default: 0
          readOnly: true
        summary_discount:
          type: double
          description: total discount applied on the invoice
          default: 0
          readOnly: true
        summary_total:
          type: double
          description: total invoice with taxes
          default: 0
          readOnly: true
        summary_paid:
          type: double
          description: total paid amount
          default: 0
          readOnly: true
        summary_unpaid:
          type: double
          description: total unpaid amount
          default: 0
          readOnly: true
        summary_deposit:
          type: double
          description: total deposited amount
          default: 0
          readOnly: true
        summary_refund:
          type: double
          description: total refunded amount
          default: 0
          readOnly: true
        notes:
          type: string
          description: Notes for the client
        html_notes:
          type: string
          description: html template notes
        created:
          type: date-time
          description: the date when the invoice was created
          readOnly: true
          examples:
            - '2018-11-07'
        modified:
          type: date-time
          description: the last date when the invoice was modified
          readOnly: true
          examples:
            - '2018-11-07'
        invoice_layout_id:
          type: integer
          format: int64
          description: >-
            the layout for viewing this invoice get it from [GET General Listing
            API with model `InvoiceLayout`](/15115384e0) if not set the default
            layout is used
          examples:
            - 1
          nullable: true
        estimate_id:
          type: integer
          format: int64
          description: >-
            The estimate of this invoice get it from [GET Estimates
            API](/15115246e0) if it's not set the primary store is used
          default: The primary store id
          examples:
            - 0
        shipping_options:
          type: integer
          description: Deposit Type
          enum:
            - ''''' => Auto'
            - 1 => Don't show shipping options
            - 2 => Show the main client details
            - 3 => Show secondary client details
          default: ''
        shipping_amount:
          type: double
          description: Deposit amount
          default: null
          nullable: true
        client_active_secondary_address:
          type: boolean
          description: 0/1 if the secondary data is active
        client_secondary_name:
          type: string
          maxLength: '255'
          description: Supplier's name
        client_secondary_address1:
          type: string
          maxLength: '255'
          description: Client's address line 1
        client_secondary_address2:
          type: string
          maxLength: '255'
          description: Client's address line 2
        client_secondary_city:
          type: string
          maxLength: '100'
          description: Client's City
        client_secondary_state:
          type: string
          maxLength: '100'
          description: Client's State
        client_secondary_postal_code:
          type: string
          maxLength: '50'
          description: Client's postal code
        client_secondary_country_code:
          type: string
          maxLength: '10'
          description: Client's country ISO "ALPHA-2" Code
        follow_up_status:
          type: integer
          description: >-
            Follow Up Status get it from [GET Follow up statuses with model
            invoice](/15115383e0)
          default: null
          nullable: true
        work_order_id:
          type: integer
          description: Work Order ID get it from [GET Work orders](/15115271e0)
          default: null
          nullable: true
        requisition_delivery_status:
          type: integer
          description: Requisition delivery Status
          enum:
            - 1 => Pending
            - 2 => Not All Available
            - 3 => Accepted
            - 4 => Cancelled
            - 5 => Modified
          default: null
          nullable: true
        pos_shift_id:
          type: integer
          description: POS session id
          default: null
          nullable: true
        source_type:
          type: integer
          description: >-
            Source type that created the invoice if it's `null` then this means
            the invoice has no source
          enum:
            - 0 => Invoice
            - 2 => Subscription
            - 3 => Estimate
            - 5 => Credit Note
            - 6 => Refund Receipt
            - 7 => BNR
            - 8 => Booking
          default: null
          readOnly: true
          nullable: true
        source_id:
          type: integer
          description: source item id that created the invoice
          default: null
          readOnly: true
          nullable: true
        qr_code_url:
          type: string
          description: >-
            direct url for the QR Code image of that invoice for KSA Electronic
            Invoice only
          examples:
            - >-
              https://yoursite.daftra.com/qr/?d64=QVE1TmIyaGhiV1ZrSUVGemFISmhaZ0lJTVRFMU16WTJRMUlERkRJd01qSXRNVEF0TWpoVU1EQTZNREU2TVRWYUJBRXdCUUV3
        invoice_html_url:
          type: string
          description: direct url that will return HTML code of the invoice
          examples:
            - >-
              https://yoursite.daftra.com/invoices/preview/2621?hash=c06543fe13bd4850b521733687c53259
        invoice_pdf_url:
          type: string
          description: direct url to download pdf version of the invoice
          examples:
            - >-
              https://yoursite.daftra.com/invoices/view/2621.pdf?hash=c06543fe13bd4850b521733687c53259
      required:
        - store_id
        - client_id
      x-apidog-orders:
        - id
        - staff_id
        - subscription_id
        - store_id
        - type
        - 'no'
        - po_number
        - name
        - client_id
        - is_offline
        - currency_code
        - client_business_name
        - client_first_name
        - client_last_name
        - client_email
        - client_address1
        - client_address2
        - client_postal_code
        - client_city
        - client_state
        - client_country_code
        - date
        - payment_status
        - draft
        - discount
        - discount_amount
        - deposit
        - deposit_type
        - summary_subtotal
        - summary_discount
        - summary_total
        - summary_paid
        - summary_unpaid
        - summary_deposit
        - summary_refund
        - notes
        - html_notes
        - created
        - modified
        - invoice_layout_id
        - estimate_id
        - shipping_options
        - shipping_amount
        - client_active_secondary_address
        - client_secondary_name
        - client_secondary_address1
        - client_secondary_address2
        - client_secondary_city
        - client_secondary_state
        - client_secondary_postal_code
        - client_secondary_country_code
        - follow_up_status
        - work_order_id
        - requisition_delivery_status
        - pos_shift_id
        - source_type
        - source_id
        - qr_code_url
        - invoice_html_url
        - invoice_pdf_url
      x-apidog-ignore-properties: []
      x-apidog-folder: ''
  securitySchemes: {}
servers:
  - url: https://{{subdomain}}.daftra.com/api2
    description: Production
  - url: ''
    description: Cloud Mock
  - url: https://{{subdomain}}.daftra.com/v2/api/entity
    description: v2
security: []

```
============================
