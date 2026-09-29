import { redirect } from 'next/navigation';

export default function CounsellingRedirect() {
    redirect('/contact?type=student');
}
