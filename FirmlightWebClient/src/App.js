import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {
    GroupPage,
    LandingPage,
    LoginPage,
    SignupPage,
    TasksPage,
    PrivacyPage,
    CookiesPage,
    TermsPage,
    ErrorPage,
    DocumentationPage,
    InfoPage
} from "./Pages";

function App() {

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/signin" element={<SignupPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/groups" element={<GroupPage/>}/>
                    <Route path="/tasks/:groupId" element={<TasksPage/>}/>
                    <Route path="/privacy" element={<PrivacyPage/>}/>
                    <Route path="/cookies" element={<CookiesPage/>}/>
                    <Route path="/terms" element={<TermsPage/>}/>
                    <Route path="/info" element={<InfoPage/>}/>
                    <Route path="/documentation" element={<DocumentationPage/>}/>
                    <Route path="/error" element={<ErrorPage/>}/>
                </Routes>
            </Router>
        </div>
    );
}


export default App;
