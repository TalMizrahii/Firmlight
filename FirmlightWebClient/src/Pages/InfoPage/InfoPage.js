import {Navbar} from "../../Components";
import {Content, Footer, Info} from "../../Containers";
import {firmlightAddress} from "../../Strings";

const InfoPage = () => {

    const sections = [
        {
            title: "Who am I?",
            content: `Firmlight is a cutting-edge distributed computation system designed to enable efficient task management within groups. Our platform allows users to create and manage groups to delegate and process computational tasks collaboratively. Whether you're working on complex projects or just need to distribute workload among team members, Firmlight offers a robust solution to streamline and optimize your tasks.`,
        },
        {
            title: "Our Mission",
            content: `At Firmlight, our mission is to empower individuals and organizations by providing a seamless platform for distributed task management. We aim to enhance productivity, foster collaboration, and make distributed computing accessible to everyone. Our goal is to simplify the process of task delegation and computation, ensuring that tasks are handled efficiently and effectively.`,
        },
        {
            title: "How It Works",
            content: `Firmlight operates on a distributed computation model where tasks are divided into smaller units and assigned to different groups or individuals. Users can create groups, define tasks, and manage their execution through our intuitive interface. Our system ensures that tasks are processed in parallel, reducing completion time and optimizing resource utilization.`,
            subPoints: [
                "Task Creation: Users can create tasks and specify parameters, deadlines, and group assignments.",
                "Group Management: Organize members into groups and assign tasks based on group roles and capabilities.",
                "Task Execution: Tasks are distributed and executed across the network, with progress and results monitored in real-time.",
                "Result Aggregation: Completed tasks are aggregated, and results are provided to users for further analysis or action.",
            ],
        },
        {
            title: "Key Features",
            content: `Firmlight offers a range of features designed to enhance task management and collaboration, including:`,
            subPoints: [
                "Distributed Task Execution: Efficiently handle large-scale tasks by distributing them across multiple nodes.",
                "Real-Time Monitoring: Track task progress and performance in real-time through our dashboard.",
                "Group Collaboration: Collaborate with team members and manage group tasks effortlessly.",
                "Scalability: Easily scale your task processing capabilities based on your needs.",
            ],
        },
        {
            title: "Get Started",
            content: `Getting started with Firmlight is easy. Sign up for an account, create or join a group, and start managing your tasks today. Our user-friendly interface and comprehensive documentation will guide you through every step of the process. Visit our [website](#) to learn more and start using Firmlight.`,
        },
        {
            title: "Contact Us",
            content: `If you have any questions, feedback, or need support, please feel free to contact us. We are here to help you make the most of Firmlight. Reach out to us at support@firmlight.com or visit our [contact page](#) for more information.`,
        },
    ];


    return (
        <>
            <Content>
                <Navbar/>
                <Info error={false} sections={sections} headline={"About Firmlight"}/>
            </Content>
            <Footer/>
        </>
    )
}
export default InfoPage;