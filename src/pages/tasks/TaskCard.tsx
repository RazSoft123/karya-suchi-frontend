import { Rocket, EllipsisVertical } from "lucide-react";

export default function TaskCard() {
  return (
    <div>
      <div>
        <div>
          <div>
            <Rocket />
          </div>
          <div>
            <EllipsisVertical />
          </div>
        </div>
        <div>
          <h3>Design Landing page</h3>
          <p>Paragraph of the task</p>
        </div>
        <div>
          <span>Workspace</span>
          <span>Due date</span>
          <span>user name</span>
        </div>
      </div>
    </div>
  );
}
