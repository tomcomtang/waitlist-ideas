import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Text,
  Section,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface EmailProps {
  userFirstname: string;
  token?: string;
}

export const WaitlistWelcomeEmail = ({ userFirstname, token }: EmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Waitlist Ideas, {userFirstname}! 🎉</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logo}>Waitlist Ideas</Text>
        </Section>

        <Section style={content}>
          <Text style={greeting}>Hi {userFirstname},</Text>
          
          <Text style={paragraph}>
            Thank you for joining the waitlist! We're thrilled to have you on board
            and can't wait to share what we've been building.
          </Text>

          <Text style={paragraph}>
            As a waitlist member, you'll be among the first to:
          </Text>

          <ul style={list}>
            <li>Get early access to our platform</li>
            <li>Receive exclusive updates and announcements</li>
            <li>Enjoy special perks and benefits</li>
            <li>Have your voice heard in shaping our product</li>
          </ul>

          <Text style={paragraph}>
            We'll keep you posted on our progress and notify you as soon as we're
            ready to launch. In the meantime, if you have any questions or feedback,
            don't hesitate to reach out by replying to this email.
          </Text>

          <Text style={paragraph}>
            We're building something special, and we're excited to have you along
            for the journey!
          </Text>

          {token ? (
            <>
              <Text style={paragraph}>
                Your waitlist token (keep this as your proof of registration):
              </Text>
              <Section style={tokenBox}>
                <Text style={tokenText}>{token}</Text>
              </Section>
              <Text style={paragraph}>
                You may need to show this token when claiming your spot or at
                check-in.
              </Text>
            </>
          ) : null}

          <Text style={signOff}>
            Best regards,
            <br />
            The Waitlist Ideas Team
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={footer}>
          <Text style={footerText}>
            You received this email because you signed up for the Waitlist Ideas
            waitlist. If you believe this is a mistake, feel free to ignore this email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

WaitlistWelcomeEmail.PreviewProps = {
  userFirstname: "Alex",
  token: "a1b2c3d4e5f6789012345678abcdef01",
} as EmailProps;

export default WaitlistWelcomeEmail;

const main = {
  backgroundColor: "#0a0a0a",
  fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
  padding: "40px 0",
};

const container = {
  margin: "0 auto",
  padding: "0 24px",
  maxWidth: "600px",
};

const header = {
  marginBottom: "32px",
  textAlign: "center" as const,
};

const logo = {
  fontSize: "28px",
  fontWeight: "700",
  background: "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  margin: "0",
};

const content = {
  backgroundColor: "#1a1a1a",
  borderRadius: "12px",
  padding: "32px",
  border: "1px solid #262626",
};

const greeting = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#ffffff",
  marginBottom: "16px",
  marginTop: "0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#d4d4d4",
  marginBottom: "16px",
  marginTop: "0",
};

const list = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#d4d4d4",
  marginBottom: "16px",
  marginLeft: "20px",
  paddingLeft: "0",
};

const tokenBox = {
  backgroundColor: "#262626",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px",
  border: "1px solid #404040",
};

const tokenText = {
  fontSize: "14px",
  fontFamily: "monospace",
  color: "#e5e5e5",
  margin: "0",
  wordBreak: "break-all" as const,
};

const signOff = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#d4d4d4",
  marginTop: "24px",
  marginBottom: "0",
};

const hr = {
  borderColor: "#262626",
  margin: "32px 0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#737373",
  margin: "0",
};
