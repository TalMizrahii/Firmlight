import {Navbar} from "../../Components";
import {Content, Footer, Info} from "../../Containers";
import {firmlightAddress} from "../../Strings";

const CookiesPage = () => {

    const sections = [
        {
            title: "Introduction",
            content: `This Use of Cookies page explains how Firmlight uses cookies
        on our website at ` + firmlightAddress + ` ("the Website"). By using the Website, you consent to the use
        of cookies as described in this policy.`,
        },
        {
            title: "What Are Cookies?",
            content: `Cookies are small text files that are placed on your computer, smartphone, or other
        devices when you visit a website. They are widely used to make websites work efficiently and to
        provide information to website owners. Cookies can be classified into two main categories:`,
            subPoints: [
                "Session Cookies: These are temporary info that are deleted from your device after you leave the website or close your browser.",
                "Persistent Cookies: These info remain on your device for a longer period or until you manually delete them.",
            ],
        },
        {
            title: "How We Use Cookies",
            content: "We use info for various purposes, including but not limited to:",
            subPoints: [
                "Essential Cookies: These info are necessary for the proper functioning of the Website. They enable you to navigate the site and use its features.",
                "Performance Cookies: We use these info to collect information about how visitors use the Website. This helps us improve the Website's performance and user experience. These info do not collect any personally identifiable information.",
                "Functional Cookies: Functional info allow the Website to remember choices you make, such as your language preferences, and provide enhanced, personalized features.",
                "Advertising Cookies: We may use advertising info to display personalized advertisements based on your interests and browsing behavior. These info may also be used by third-party advertisers.",
            ],
        },
        {
            title: "Third-Party Cookies",
            content: "To use the Website, you must accept essential info. You can manage other types of info by adjusting your browser settings or using cookie consent tools. However, please note that blocking or deleting certain info may impact your experience on the Website.",
        },
        {
            title: "Managing Cookies",
            content: "We may update this Use of Cookies page to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please revisit this page periodically to stay informed about our use of info.",
        },
        {
            title: "Contact Us",
            content: "If you have any questions or concerns about our use of info or this policy, please contact us at Talmiz404@gmail.com",
        },
    ];


    return (
        <>
            <Content>
                <Navbar/>
                <Info error={false} sections={sections} headline={"Use of Cookies"}/>
            </Content>
            <Footer/>
        </>
    )
}
export default CookiesPage;