import { login } from "../HTTPcalls";

const Login: React.FC = () => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col bg-orange p-4 m-4 items-center rounded-xl w-fit justify-center">
        <div className="p-4 m-4 flex flex-col items-center">
          <label htmlFor="mail" className="my-3">
            Email
          </label>
          <input
            type="email"
            placeholder="mail"
            id="mail"
            className="p-2 rounded-lg"
          ></input>
          <label htmlFor="password" className="my-3">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="password"
            id="password"
            className="rounded-lg p-2"
          />
        </div>
        <div className="p-4 m-4 flex flex-col items-center text-white bg-grey rounded-xl">
          <button
            onClick={() => {
              login(
                (document.getElementById("mail") as HTMLInputElement).value,
                (document.getElementById("password") as HTMLInputElement).value,
              ).then(() => {
                location.reload();
              });
            }}
          >
            Login
          </button>
        </div>
        <div className="m-4">OR</div>
        <div>
          <button className=" rounded-xl bg-grey p-4 m-4 text-white">
            <a
              href="http://localhost:3000/api/auth/google"
              className="mx-4 flex flex-row"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"></img>
              Login with Google
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
