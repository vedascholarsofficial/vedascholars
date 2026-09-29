import { redirect } from 'next/navigation';

export default function GetStartedRedirect() {
    redirect('/contact?type=student');
}
