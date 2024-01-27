import React, { useEffect } from "react";
import classNames from "classnames";

import { Lawyer } from "../../core/models/lawyer";

type Props = {
  lawyersList: Lawyer[];
  lawyer: Lawyer;
  setLawyersList: (lawyers: Lawyer[]) => void;
};

export const LawyerTablePerson: React.FC<Props> = ({
  lawyersList,
  lawyer,
  setLawyersList,
}) => {
  useEffect(() => {
    findDuplicatesAndMark();
  }, [lawyer]);

  const statesValidator = (states: string) => {
    return states
      .split("|")
      .map((state: string) => state.slice(0, 3).toUpperCase())
      .join(", ");
  };

  const phoneNumberValidator = (): string | boolean => {
    const cleanedNumber = lawyer?.phone.replace(/\D/g, "");

    if (cleanedNumber.length === 10) {
      return `+1${cleanedNumber}`;
    } else if (cleanedNumber.length === 11 && cleanedNumber.startsWith("1")) {
      return `+1${cleanedNumber.slice(1)}`;
    } else if (cleanedNumber.length === 12 && cleanedNumber.startsWith("+1")) {
      return cleanedNumber;
    } else {
      return lawyer?.phone;
    }
  };

  const hasChildrenValidator = () => {
    if (lawyer?.has_children === "TRUE") {
      return true;
    } else if (
      lawyer?.has_children === "FALSE" ||
      lawyer?.has_children === ""
    ) {
      return false;
    }
  };

  const findDuplicatesAndMark = () => {
    const { email, phone, id } = lawyer;

    const duplicates = lawyersList.find(
      (obj) =>
        (obj.email?.toLowerCase() === email?.toLowerCase() ||
          obj.phone === phone) &&
        obj.id !== id
    );

    const newList = lawyersList.map((lawyer: Lawyer) => {
      if (lawyer.id === id) {
        lawyer.duplicate_with = String(duplicates?.id || "");
      }

      return lawyer;
    });

    setLawyersList(newList);
  };

  const duplicatesEmailChecker = () => {
    return lawyersList
      .slice()
      .some(
        (obj) =>
          obj.email?.toLowerCase() === lawyer?.email?.toLowerCase() &&
          obj.id !== lawyer?.id
      );
  };

  const duplicatesPhoneChecker = () => {
    return lawyersList
      .slice()
      .some(
        (obj) =>
          obj?.phone?.replace(/\D/g, "") ===
            lawyer?.phone?.replace(/\D/g, "") && obj.id !== lawyer?.id
      );
  };

  const yearIncomeChecker = () => {
    return (
      Number(lawyer?.yearly_income) < 0 ||
      Number(lawyer?.yearly_income) > 1000000 ||
      Number.isNaN(lawyer?.yearly_income) ||
      lawyer?.yearly_income === ""
    );
  };

  const emailChecker = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return !emailRegex.test(lawyer?.email);
  };

  const dateChecker = (): boolean => {
    const regex =
      /^(?:\d{4}-\d{2}-\d{2}|(?:0[1-9]|1[0-2])\/(?:0[1-9]|[12]\d|3[01])\/\d{4})$/;

    const date = new Date(lawyer?.expiration_date);
    const today = new Date();

    return !regex.test(lawyer?.expiration_date) || date >= today;
  };

  const phoneNumberChecker = () => {
    const cleanedNumber = lawyer?.phone.replace(/\D/g, "");

    if (
      cleanedNumber.length === 10 ||
      (cleanedNumber.length === 11 && cleanedNumber.startsWith("1")) ||
      (cleanedNumber.length === 12 && cleanedNumber.startsWith("+1"))
    ) {
      return false;
    } else {
      return true;
    }
  };

  function licenseNumberChecker() {
    const pattern = /^[0-9a-zA-Z]{6}$/;
    return !pattern.test(lawyer?.license_number);
  }

  return (
    <tr>
      <td>{lawyer.id}</td>
      <td>{lawyer?.full_name}</td>
      <td
        className={classNames({
          "invalid-field": phoneNumberChecker() || duplicatesPhoneChecker(),
        })}
      >
        {phoneNumberValidator()}
      </td>
      <td
        className={classNames({
          "invalid-field": emailChecker() || duplicatesEmailChecker(),
        })}
      >
        {lawyer?.email}
      </td>
      <td
        className={classNames({
          "invalid-field": Number(lawyer.age) < 21 || Number(lawyersList) <= 0,
        })}
      >
        {lawyer?.age}
      </td>
      <td
        className={classNames({
          "invalid-field":
            Number(lawyer.experience) > Number(lawyer.age) ||
            Number(lawyer.experience) < 0,
        })}
      >
        {lawyer?.experience}
      </td>
      <td
        className={classNames({
          "invalid-field": yearIncomeChecker(),
        })}
      >
        {parseFloat(lawyer?.yearly_income?.replace(/[^\d.]/g, "")).toFixed(2)}
      </td>
      <td
        className={classNames({
          "invalid-field": hasChildrenValidator(),
        })}
      >
        {String(lawyer?.has_children).toUpperCase()}
      </td>
      <td
        className={classNames({
          "invalid-field": lawyer?.license_states.length <= 0,
        })}
      >
        {statesValidator(lawyer?.license_states)}
      </td>
      <td
        className={classNames({
          "invalid-field": dateChecker(),
        })}
      >
        {lawyer?.expiration_date}
      </td>
      <td
        className={classNames({
          "invalid-field": licenseNumberChecker(),
        })}
      >
        {lawyer?.license_number}
      </td>
      <td>{lawyer?.duplicate_with}</td>
    </tr>
  );
};

export default LawyerTablePerson;
