import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail app password
  },
});

export async function sendOnboardingEmail(to: string, tempPassword: string, orgName: string) {
  const mailOptions = {
    from: `"BillCraft" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Welcome to BillCraft - Your Account Details",
    html: `
      <h2>Welcome to ${orgName} on BillCraft!</h2>
      <p>Your account has been created. Here are your login details:</p>
      <ul>
        <li><b>Username:</b> ${to}</li>
        <li><b>Temporary Password:</b> ${tempPassword}</li>
      </ul>
      <p>Please <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth">login</a> and change your password.</p>
      <br/>
      <p>Thank you,<br/>BillCraft Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}

export async function sendAssignmentNotification(to: string, storeNames: string[], orgName: string) {
  const mailOptions = {
    from: `"BillCraft" <${process.env.GMAIL_USER}>`,
    to,
    subject: "New Store Assignment on BillCraft",
    html: `
      <h2>You've been assigned to a new store in ${orgName}</h2>
      <p>The following store(s) have been assigned to you:</p>
      <ul>
        ${storeNames.map((name) => `<li>${name}</li>`).join("")}
      </ul>
      <p>Please <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth">login</a> to access your stores.</p>
      <br/>
      <p>Thank you,<br/>BillCraft Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}

export function generateUserPassword(userName: string, storeName: string) {
  // Take first 3 letters of user name, first 3 of store, and a random 3-digit number
  const namePart = userName.replace(/\s+/g, "").slice(0, 3).toLowerCase();
  const storePart = storeName.replace(/\s+/g, "").slice(0, 3).toLowerCase();
  const randomPart = Math.floor(100 + Math.random() * 900); // random 3-digit number
  return `${namePart}${storePart}@${randomPart}`;
}