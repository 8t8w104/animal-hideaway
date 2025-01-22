import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/app/components/form-message";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
      <h1 className="text-2xl font-medium">Reset password</h1>
      <p className="text-sm text-foreground/60">
        Please enter your new password below.
      </p>
      <label htmlFor="password">New password</label>
      <input
        type="password"
        name="password"
        placeholder="New password"
        required
      />
      <label htmlFor="confirmPassword">Confirm password</label>
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        required
      />
      <div>
        Reset password
      </div>
      <FormMessage message={searchParams} />
    </form>
  );
}
