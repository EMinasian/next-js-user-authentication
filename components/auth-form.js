"use client"

import Link from 'next/link';
import authAction from '@/actions/auth-action';
// import { useActionState } from "react";
import { useFormState } from 'react-dom';
import { useSearchParams } from 'next/navigation'


export default function AuthForm() {

  const searchParams = useSearchParams()
  const accessMode = searchParams.get('mode')

  const [state, formAction] = useFormState(authAction.bind(null, accessMode), {});

  return (
    <form id="auth-form" action={formAction}>
      <div>
        <img src="/images/auth-icon.jpg" alt="A lock icon" />
      </div>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>
      {
        state?.errors && (
          <ul id="form-errors">
            {Object.entries(state?.errors).map(([key, value]) => <li key={key}>{value}</li>)}
          </ul>
        )
      }
      <p>
        <button type="submit">
          {`${accessMode === 'login' ? 'Login' : 'Create Account'}`}
        </button>
      </p>
      <p>
        {
          accessMode === 'login' ? (
            <Link href="/">Create new account.</Link>
          ) : (
            <Link href="/?mode=login">Login with existing account.</Link>
          )
        }  
      </p>
    </form>
  );
}
