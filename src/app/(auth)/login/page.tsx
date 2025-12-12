import dynamic from "next/dynamic";
import Image from "next/image";

import headset from "@assets/svg/headset.svg";
import logoLogin from "@assets/svg/logo-login.svg";

const LoginForm = dynamic(() => import("@/components/forms/LoginForm"), {
  ssr: true,
});

export const metadata = {
  title: "Login - TruckMatch",
};

export default function LoginPage() {
  return (
    <body>
      <div className="page-wrapper">
        <section className="login-sec">
          <div className="container-fluid px-lg-0">
            <div className="row login-sec-row mx-lg-0">
              <div className="col-lg-6 col-12 px-lg-0">
                <div className="text-end d-block d-lg-none mt-3 mb-2">
                  <a href="#" className="btn login-sec-cu-btn">
                    <span className="login-sec-cu-icon">
                      <svg
                        width="27"
                        height="27"
                        viewBox="0 0 27 27"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.24345 21.0093C8.64178 21.0093 9.02378 20.8511 9.30544 20.5694C9.58709 20.2878 9.74533 19.9058 9.74533 19.5075V15.0019C9.74533 14.6035 9.58709 14.2215 9.30544 13.9399C9.02378 13.6582 8.64178 13.5 8.24345 13.5V12.749C8.24345 11.3549 8.79727 10.0179 9.78306 9.03211C10.7689 8.04631 12.1059 7.4925 13.5 7.4925C14.8941 7.4925 16.2311 8.04631 17.2169 9.03211C18.2027 10.0179 18.7565 11.3549 18.7565 12.749V13.5C18.3582 13.5 17.9762 13.6582 17.6946 13.9399C17.4129 14.2215 17.2547 14.6035 17.2547 15.0019V19.5075H15.0019C14.8027 19.5075 14.6117 19.5866 14.4709 19.7274C14.3301 19.8682 14.2509 20.0592 14.2509 20.2584C14.2509 20.4576 14.3301 20.6486 14.4709 20.7894C14.6117 20.9302 14.8027 21.0093 15.0019 21.0093H18.7565C19.6171 21.0068 20.4507 20.7086 21.1177 20.1649C21.7848 19.6211 22.2447 18.8647 22.4207 18.0223C22.5966 17.1799 22.4778 16.3026 22.0842 15.5373C21.6906 14.772 21.046 14.1652 20.2584 13.8184V12.749C20.2584 10.9566 19.5464 9.23757 18.2789 7.97013C17.0115 6.70268 15.2924 5.99063 13.5 5.99063C11.7076 5.99063 9.98853 6.70268 8.72108 7.97013C7.45363 9.23757 6.74158 10.9566 6.74158 12.749V13.8184C5.95397 14.1652 5.3094 14.772 4.91578 15.5373C4.52215 16.3026 4.40337 17.1799 4.57931 18.0223C4.75525 18.8647 5.21524 19.6211 5.88227 20.1649C6.54929 20.7086 7.38287 21.0068 8.24345 21.0093Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                    Contact Us
                  </a>
                </div>
                <div className="login-sec-left-con">
                  <div className="login-sec-left-wrap-m">
                    <div className="login-sec-left-wrap">
                      <div className="login-sec-logo">
                        <a href="#">
                          <Image
                            src={logoLogin.src}
                            alt="Image"
                            width={30}
                            height={30}
                          />
                        </a>
                      </div>
                    </div>
                    <div className="ft-links-main d-lg-block d-none">
                      <ul className="list-unstyled ft-links">
                        <li>
                          <a href="#">Teams & Conditions</a>
                        </li>
                        <li>
                          <a href="#">Privacy Policy</a>
                        </li>
                        <li>
                          <a href="#">Customer Support</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-12 px-lg-0">
                <div className="login-sec-right-con">
                  <div className="login-sec-right-wrap login-sec-right-wrap-h">
                    <div className="login-sec-cu-btn-wrap d-none d-lg-block">
                      <a href="#" className="btn login-sec-cu-btn">
                        <span className="login-sec-cu-icon">
                          <Image
                            src={headset.src}
                            alt="Image"
                            width={30}
                            height={30}
                          />
                        </span>
                        Contact Us
                      </a>
                    </div>
                    <div className="login-form-main login-cform-main">
                      <LoginForm />
                    </div>
                    <div className="ft-links-main-mob d-block d-lg-none my-4">
                      <ul className="list-unstyled ft-links">
                        <li>
                          <a href="#">Teams & Conditions</a>
                        </li>
                        <li>
                          <a href="#">Privacy Policy</a>
                        </li>
                        <li>
                          <a href="#">Customer Support</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </body>
  );
}
