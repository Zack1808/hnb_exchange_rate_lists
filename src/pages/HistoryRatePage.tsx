import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import {
  Container,
  DatePicker,
  Button,
  Input,
  Table,
  Loader,
} from "../components";

import {
  getFormatedCurrentDate,
  changeDateByDays,
  sort,
  getSpecificItemList,
  getUniqueList,
  addPercentageChange,
} from "../helpers";

import { useGetListings } from "../hooks/useGetListings";

const HistoryRatePage: React.FC = () => {
  const [date, setDate] = useState<string>(getFormatedCurrentDate());
  const [daysBackwards, setDaysBackwards] = useState<number>(2);
  const [data, setData] = useState<Record<string, any>[]>([]);

  const headers = [
    {
      title: "Valuta",
      value: "valuta",
    },
    {
      title: "Broj tečajnice",
      value: "broj_tecajnice",
    },
    {
      title: "Datum Primjene",
      value: "datum_primjene",
    },
    {
      title: "Država",
      value: "drzava",
    },
    {
      title: "Država ISO",
      value: "drzava_iso",
    },
    {
      title: "Kupovni tečaj",
      value: "kupovni_tecaj",
    },
    {
      title: "Srednji tečaj",
      value: "srednji_tecaj",
    },
    {
      title: "Prodajni tečaj",
      value: "prodajni_tecaj",
    },
    {
      title: "Šifra valute",
      value: "sifra_valute",
    },
    {
      title: "Rast/Pad tečaja",
      value: "postotak",
    },
  ];

  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, getCurrencyHistory } = useGetListings();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const days = new URLSearchParams(location.search);
    if (
      Number(days.get("broj-dana-unazad")) === daysBackwards &&
      params.date === date
    )
      return;
    if (date === getFormatedCurrentDate())
      navigate(
        `/povijest/${params.currency}?broj-dana-unazad=${daysBackwards}`
      );
    else
      navigate(
        `/povijest/${params.currency}/${date}?broj-dana-unazad=${daysBackwards}`
      );
    fetchList(
      date,
      changeDateByDays({
        date,
        daysAmount: -daysBackwards,
      })
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDaysBackwards(Number(event.target.value));
  };

  const handleBlur = () => {
    if (daysBackwards < 2) setDaysBackwards(2);
    if (daysBackwards > 60) setDaysBackwards(60);
  };

  const fetchList = async (fromDate: string, toDate: string) => {
    if (!params.currency) return;
    let list = await getCurrencyHistory(fromDate, toDate);
    list = getSpecificItemList(list, "valuta", params.currency);
    list = getUniqueList(list, "broj_tecajnice");
    list = sort({
      data: list,
      key: "datum_primjene",
      direction: "asc",
      isNumber: false,
    });
    console.log(list);
    list = addPercentageChange(list);
    console.log(list);
    setData(list);
  };

  const colorRow = (index: number) => {
    if (index === data.length - 1) return "bg-gray-100";
    if (
      Number(data[index].srednji_tecaj.replace(",", "")) >
      Number(data[index + 1].srednji_tecaj.replace(",", ""))
    )
      return "bg-green-400";
    return "bg-red-400";
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const search = new URLSearchParams(location.search);
    let selectedDate = date;
    let selectedAmountOfDays = daysBackwards;
    if (params.date) {
      setDate(params.date);
      selectedDate = params.date;
    }
    if (search.size) {
      setDaysBackwards(Number(search.get("broj-dana-unazad")));
      selectedAmountOfDays = Number(search.get("broj-dana-unazad"));
    }

    fetchList(
      selectedDate,
      changeDateByDays({
        date: selectedDate,
        daysAmount: -selectedAmountOfDays,
      })
    );
  }, []);

  return (
    <>
      <Container spacing="medium">
        <h1 className="text-5xl mt-20 font-semibold text-gray-800 flex flex-col items-start justify-start">
          Povijest tečaja
        </h1>
        <p className="text-lg text-gray-800">
          Ovdje možete provjeriti povijest tečajne liste za odabranu valutu.
        </p>
      </Container>
      <Container spacing="medium" background>
        <h3 className="text-xl font-semibold text-red-600">Napomena</h3>
        <p className="text-lg text-gray-800">
          Ovdje se prikazuju samo tečajne liste od uvođenja eura (01.01.2023).
          Podaci prije 01.01.2023 se neće prikazivati.
          <br />
          Također mogu se prikazat podaci do 60 dana unazad od odabranog datuma,
          sve do 01.01.2023.
        </p>
        <form
          className="flex mt-5 gap-5 w-full justify-start items-end flex-col md:flex-row md"
          onSubmit={handleSubmit}
        >
          <fieldset className="flex gap-1 flex-col w-full md:max-w-sm">
            <label htmlFor="datum-primjene" className="text-lg">
              Datum Primjene
            </label>
            <DatePicker
              disabled={!!params.date}
              value={date}
              onChange={setDate}
              min={"2023-01-01"}
              max={getFormatedCurrentDate()}
              name="datum-primjene"
              id="datum-primjene"
            />
          </fieldset>
          <fieldset className="flex gap-1 flex-col w-full md:max-w-sm">
            <label htmlFor="broj-dana-unazad" className="text-lg">
              Prikaži liste unazad:
            </label>
            <Input
              type="number"
              className="bg-white"
              value={daysBackwards}
              onChange={handleChange}
              name="broj-dana-unazad"
              id="broj-dana-unazad"
              onBlur={handleBlur}
            />
          </fieldset>
          <Button primary className="justify-center w-full md:w-auto">
            Prikaži povijest
          </Button>
        </form>
      </Container>

      <Container spacing="medium">
        {loading && <Loader />}
        {!loading && error && <p className="text-red-600 text-lg">{error}</p>}
        {!loading && data.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800">
              Povijest tečaja za {data[0].valuta}
            </h2>
            <Table data={data} headers={headers} colorRow={colorRow} />
          </>
        )}
      </Container>
    </>
  );
};

export default HistoryRatePage;
