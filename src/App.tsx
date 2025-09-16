import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Addons from './pages/Addons';
import Confirm from './pages/Confirm';
import { Admin } from './pages/admin/Admin';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/c/:categoryId" element={<Addons />} />
        <Route path="/confirm/:orderId" element={<Confirm />} />

        <Route path="/admin" element={<Admin />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
