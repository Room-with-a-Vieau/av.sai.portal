/**
 * Paste into the Location Search rendering **ComponentQuery** field in Sitecore CM.
 * Datasource should be the Locations folder; children are location items.
 */
export const LOCATION_SEARCH_COMPONENT_QUERY = /* GraphQL */ `
  query LocationSearchQuery($datasource: String!, $language: String!) {
    datasource: item(path: $datasource, language: $language) {
      id
      children(first: 500) {
        results {
          id
          Name: field(name: "Name") {
            value
          }
          StreetAddress: field(name: "Street Address") {
            value
          }
          City: field(name: "City") {
            value
          }
          State: field(name: "State") {
            value
          }
          ZIP: field(name: "ZIP") {
            value
          }
          GEO: field(name: "GEO") {
            value
          }
          ParentCompany: field(name: "Parent Company") {
            value
          }
          SubsidiaryName: field(name: "Subsidiary Name") {
            value
          }
        }
      }
    }
  }
`;
