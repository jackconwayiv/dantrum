import { Avatar, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  "https://fuhffnswmsbjuhibaonu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1aGZmbnN3bXNianVoaWJhb251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAyMzIwMDQsImV4cCI6MjAwNTgwODAwNH0.p2gr1qany_1ktzea0tzxvJ9SxgsBqKtax4AXkcX1reo"
);
export default function App() {
  const [session, setSession] = useState<any>(null);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  } else {
    return (
      <Flex direction="column" p="10px" m="20px">
        <Heading m="20px">DANTRUM.COM</Heading>
        <Heading m="20px">
          Welcome, {session.user.user_metadata.full_name}!
        </Heading>
        <Avatar
          size="2xl"
          name={session.user.user_metadata.full_name}
          src={session.user.user_metadata.avatar_url}
          referrerPolicy="no-referrer"
        />
        <Text m="20px">
          "Every journey begins with a single footstep." -Dan
        </Text>
        <Button
          m="20px"
          width="200px"
          colorScheme="orange"
          onClick={handleSignOut}
        >
          Log Out
        </Button>
        <pre>{JSON.stringify(session.user, null, 4)}</pre>
      </Flex>
    );
  }
}
