import Intro from "../../Containers/Intro/Intro";
import SignUpInputs from "./SignUpInputs";

const SignupPage = () => {
    return (
        <>
            <Intro inputs={<SignUpInputs/>}/>
        </>
    )
}
export default SignupPage;
