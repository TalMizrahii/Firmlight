import {Navbar} from "../../Components";
import {Content, Footer, Info} from "../../Containers";

const ErrorPage = () => {

    // The sections for the info page.
    const sections = [
        {
            title: "Try to access the page again and sign in. If the problem persists, please contact us at Talmiz404@gmail.com",
            content: ""
        },
    ];

    return (
        <>
            <Content>
                <Navbar/>
                <Info error={true} sections={sections} headline={"Oops! Something went wrong..."}/>
            </Content>
            <Footer error={true}/>
        </>
    )
}
export default ErrorPage;