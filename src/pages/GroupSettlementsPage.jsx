import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Card, Container } from "react-bootstrap";
import { computeGroupSettlements, currentUser, groups } from "../data/dummyData";
import SettlementSummary from "../components/settlements/SettlementSummary";
import { useSelector } from "react-redux";

export default function GroupSettlementsPage() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const activeUser = user ?? currentUser;

  const group = groups.find((item) => item._id === groupId);
  const settlements = useMemo(() => computeGroupSettlements(groupId), [groupId]);

  return (
    <Container fluid="xl" className="py-4">
      <Button variant="link" className="mb-3 p-0 text-muted" onClick={() => navigate(`/groups/${groupId}`)}>
        ← Back to Group Details
      </Button>

      {!group ? (
        <Alert variant="warning">Group not found.</Alert>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-bottom fw-semibold py-3">
            Settlements · {group.name}
          </Card.Header>
          <Card.Body>
            <SettlementSummary settlements={settlements} currentUserId={activeUser._id} />
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}