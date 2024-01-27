import { Lawyer } from "../../core/models/lawyer";
import LawyerTablePerson from "../LawyerTablePerson";

type Props = {
  lawyersList: Lawyer[];
  setLawyersList: (lawyers: Lawyer[]) => void;
};

export const LawyerTable: React.FC<Props> = ({
  lawyersList,
  setLawyersList,
}) => {
  return (
    <>
      {lawyersList.length > 0 && (
        <table className="lawyers">
          <thead className="lawyers__heading">
            <tr className="lawyers__heading-box">
              <th>ID</th>
              <td>Full Name</td>
              <td>Phone</td>
              <td>Email</td>
              <td>Age</td>
              <td>Experience</td>
              <td>Yearly Income</td>
              <td>Has Children</td>
              <td>License States</td>
              <td>Expiration Date</td>
              <td>License Number</td>
              <td>Duplicate With</td>
            </tr>
          </thead>
          <tbody>
            {lawyersList
              .slice(0, lawyersList.length - 1)
              .map((lawyer: Lawyer, index: number) => (
                <LawyerTablePerson
                  key={lawyer.id}
                  lawyersList={lawyersList}
                  lawyer={lawyer}
                  setLawyersList={setLawyersList}
                />
              ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default LawyerTable;
