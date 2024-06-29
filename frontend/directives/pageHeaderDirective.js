export default function PageHeaderDirective() {
  return {
    restrict: "E",
    scope: {
      pageTitle: "@",
    },
    template: `
        <div class="row">
          <div class="col">
            <div class="page-header bg-white text-white text-center shadow py-4 mb-4 rounded">
              <h1 class="display-4 m-0 text-primary">{{ pageTitle }}</h1>
            </div>
          </div>
        </div>
      `,
  };
}
