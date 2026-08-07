"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { promoteStudent } from "@/services/academic.service";

export function PromotionModal({ open, studentId, onClose }: { open: boolean; studentId: string; onClose: () => void }) {
  const [payload, setPayload] = useState({ academic_session_id: "", class_id: "", arm_id: "", academic_status: "Active", remarks: "" });
  const update = (key: string, value: string) => setPayload((current) => ({ ...current, [key]: value }));
  const submit = async () => {
    await promoteStudent(studentId, payload);
    onClose();
  };
  return <Modal open={open} title="Promote Student" onClose={onClose}><div className="space-y-3"><Input placeholder="New Academic Session ID" value={payload.academic_session_id} onChange={(event) => update("academic_session_id", event.target.value)} /><Input placeholder="New Class ID" value={payload.class_id} onChange={(event) => update("class_id", event.target.value)} /><Input placeholder="New Arm ID" value={payload.arm_id} onChange={(event) => update("arm_id", event.target.value)} /><Select value={payload.academic_status} onChange={(event) => update("academic_status", event.target.value)}><option>Active</option><option>Repeated</option><option>Transferred</option><option>Withdrawn</option><option>Graduated</option></Select><Textarea placeholder="Remarks" value={payload.remarks} onChange={(event) => update("remarks", event.target.value)} /><Button className="w-full" onClick={submit}>Submit Promotion</Button></div></Modal>;
}
