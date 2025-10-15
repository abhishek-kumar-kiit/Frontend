import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesListPage from './pages/CoursesListPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import CourseDetailPage from './pages/CourseDetailPage';
import MyCoursesPage from './pages/MyCoursesPage';
import CreateCoursePage from './pages/CreateCoursePage';
import EditCoursePage from './pages/EditCoursePage';
import ManageCoursePage from './pages/ManageCoursePage';
import EnrolledStudentsPage from './pages/EnrolledStudentsPage';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import "@fortawesome/fontawesome-free/css/all.min.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* --- Public Routes --- */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="courses" element={<CoursesListPage />} />
          <Route path="courses/:courseId" element={<CourseDetailPage />} />

          {/* --- Protected Routes --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="instructor/my-courses" element={<MyCoursesPage />} />
            <Route path="instructor/courses/create" element={<CreateCoursePage />} />
            <Route path="instructor/courses/:courseId/edit" element={<EditCoursePage />} />
            <Route path="instructor/courses/:courseId/manage" element={<ManageCoursePage />} />
            <Route path="instructor/courses/:courseId/students" element={<EnrolledStudentsPage />} />

          </Route>

          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboardPage />} /> 
             <Route path="users" element={<AdminUsersPage />} />
              <Route path="courses" element={<AdminCoursesPage />  }/>
            </Route>
          </Route>


        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;