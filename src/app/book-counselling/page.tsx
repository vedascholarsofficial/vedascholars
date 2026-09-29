import { redirect } from 'next/navigation';

export default function BookCounsellingRedirect() {
    redirect('/contact?type=student');
}
