import { Request, Response } from "express"

import { CustomerGroupService } from "../../../../services"
import { FindParams } from "../../../../types/common"

/**
 * @oas [get] /customer-groups/{id}
 * operationId: "GetCustomerGroupsGroup"
 * summary: "Get a Customer Group"
 * description: "Retrieves a Customer Group."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Customer Group.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in the customer group.
 *   - (query) fields {string} (Comma separated) Which fields should be included in the customer group.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.customerGroups.retrieve(customer_group_id)
 *       .then(({ customer_group }) => {
 *         console.log(customer_group.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/customer-groups/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Customer Group
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             customer_group:
 *               $ref: "#/components/schemas/CustomerGroup"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params

  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  const customerGroup = await customerGroupService.retrieve(
    id,
    req.retrieveConfig
  )

  res.json({ customer_group: customerGroup })
}

export class AdminGetCustomerGroupsGroupParams extends FindParams {}
