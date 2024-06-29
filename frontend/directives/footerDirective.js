// directives/footerDirective.js

export default function FooterDirective() {
  return {
    restrict: "E",
    template: `

          <footer class="bg-light text-center text-white">
            <div class="container p-4 pb-0">
              <section class="mb-4">
                <!-- Facebook -->
      <a   class="btn btn-primary btn-floating m-1"   style="background-color: #3b5998;"  href="https://www.facebook.com/vanrisesolutions/" role="button"  ><i class="fab fa-facebook-f"></i ></a>
                <!-- Google -->
                <a class="btn btn-primary btn-floating m-1" style="background-color: #dd4b39;" href="https://vanrise.com/" role="button">
                  <i class="fab fa-google"></i>
                </a>
                <!-- Instagram -->
                <a class="btn btn-primary btn-floating m-1" style="background-color: #ac2bac;" href="https://www.instagram.com/vanrise.solutions/" role="button">
                  <i class="fab fa-instagram"></i>
                </a>
                <!-- Linkedin -->
                <a class="btn btn-primary btn-floating m-1" style="background-color: #0082ca;" href="https://www.linkedin.com/company/vanrise/mycompany/" role="button">
                  <i class="fab fa-linkedin-in"></i>
                </a>
              </section>
            </div>
            <!-- Copyright -->
            <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2);">
              © 2024 Copyright:
              <a class="text-white" href="https://vanrise.com/">Vanrise Solutions</a>
            </div>
            <!-- Copyright -->
          </footer>
        
      `,
  };
}
