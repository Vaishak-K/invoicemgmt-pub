import { TableBody } from "@/components/ui/table";
import React, { cache, useEffect, useRef, useState } from "react";
import AddItem from "./AddItem";

import { Button } from "@/components/ui/button";
import * as _ from "lodash";

function Tablebody({
  db,
  setTotal,
  quantity,
  maintotal,
  current,
  error,
}: {
  db: any;
  setTotal: Function;
  quantity?: any;
  maintotal: Number;
  current: any;
  error: any;
}) {
  let { current: quan } = useRef<any>(quantity ? JSON.parse(quantity) : []);

  // quantity ? (quan = JSON.parse(quantity)) : (quan = []);

  const [val, setVal] = useState([]);
  const [add, setAdd] = useState(quan?.length || 0);

  let deleteQuan: any;
  let array1: Number[];
  let abc: any;
  console.log("Error in Tablebody", error);
  useEffect(() => {
    if (quan) {
      array1 = _.range(0, quan.length);
      abc = [...val, ...array1];
      console.log(abc);
      quantity ? setVal(abc) : "";
    }
  }, []);

  quan = quan ? quan : [];

  const rendered = val.map((b: any, i: number) => {
    // console.log(b, " is running");
    return quan[i] ? (
      <AddItem
        db={db}
        key={b}
        id={i}
        error={error[b]}
        setTotal={setTotal}
        handleDelete={handleDelete}
        quantity={quan[b]}
        maintotal={maintotal}
      />
    ) : (
      <AddItem
        db={db}
        key={b}
        id={i}
        error={error[b]}
        setTotal={setTotal}
        handleDelete={handleDelete}
      />
    );
  });

  function handleAdd() {
    setAdd((p: number) => p + 1);
    const abc: any = [...val, add];
    setVal(abc);
  }

  function handleDelete(id: number, total: number) {
    console.log("Before ", val);
    const deleteval = [...val];
    deleteval.splice(id, 1);
    rendered.splice(id, 1);
    if (quan && quan.length > 0) {
      deleteQuan = quan.splice(id, 1);
      current.push(deleteQuan);
    }
    console.log("DeleteQuan: ", current);
    console.log("Quan ", quan);
    console.log("After ", deleteval);
    setVal(deleteval);
    setTotal((p: number) => p - total);
  }

  return (
    <>
      <TableBody>
        {rendered}
        {error[0]?.items && (
          <div className="text-destructive">{error[0]?.items}</div>
        )}
        <Button type="button" onClick={handleAdd}>
          Add
        </Button>
      </TableBody>
    </>
  );
}

export default Tablebody;
