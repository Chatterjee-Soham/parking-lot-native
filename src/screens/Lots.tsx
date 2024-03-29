/** @format */

import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { style } from "../styles/screens";

type lotsPropsType = {
  route: {
    params: {
      lots: number;
    };
  };
};

const Lots: FC<lotsPropsType> = (props) => {
  const [lotsList, setLotsList] = useState<any[]>([]);
  const [currentLot, setCurrentLot] = useState<number>(0);
  const [freeLotsList, setFreeLotsList] = useState<any[]>(lotsList);
  const [reg, setReg] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);
  const [showSnack, setShowSnack] = useState<boolean>(false);
  const [regid, setRegid] = useState<any>();

  const [hrs, setHrs] = useState<number>(0);
  const [amnt, setAmnt] = useState<number>(0);

  useEffect(() => {
    drawLots();
  }, []);

  useEffect(() => {
    setFreeLotsList(lotsList.filter((lot) => lot.free));
  }, [lotsList]);

  function drawLots() {
    let lotsArray = [];
    for (let i = 0; i < props.route.params.lots; i++) {
      lotsArray.push({
        id: i,
        reg: "",
        free: true,
        start: new Date(0, 0, 0),
      });
    }
    setLotsList(lotsArray);
  }

  function getRandom() {
    const randomNum = Math.floor(Math.random() * freeLotsList.length);
    setCurrentLot(freeLotsList[randomNum].id);
  }

  function handleAdd(random: boolean) {
    setReg("");
    if (freeLotsList.length > 0) {
      if (random) {
        getRandom();
      }
      if (currentLot >= 0) {
        setShowAddModal(true);
      }
    } else {
      setShowSnack(true);
      setTimeout(() => {
        setShowSnack(false);
      }, 2000);
    }
  }

  function handleRemove(reg: any) {
    !lotsList[currentLot].free && setShowRemoveModal(true);
    setRegid(reg);
  }

  function calculateHrsAmt() {
    const timeDiffms = Math.abs(
      lotsList[currentLot].start.getTime() - new Date().getTime()
    );
    console.log(timeDiffms);
    const timeDiffHrs = Math.floor(timeDiffms / (1000 * 60 * 60));
    console.log(timeDiffHrs);
    setHrs(timeDiffHrs);

    if (timeDiffHrs <= 2) {
      setAmnt(10);
    } else {
      setAmnt(10 + (timeDiffHrs - 2) * 10);
    }
  }

  return (
    <SafeAreaView testID="lots" style={style.container2}>
      {/* Add Modal */}
      <Snackbar
        visible={showSnack}
        onDismiss={() => setShowSnack(false)}
        style={style.snack}
      >
        <Text style={style.snackText}>the parking is full</Text>
      </Snackbar>
      <Modal visible={showAddModal} animationType="slide">
        <View style={style.modal}>
          <Text>Add Vehicle to P{currentLot}</Text>
          <TextInput
            testID="lotstext"
            placeholder="Enterv reg. number"
            placeholderTextColor={"grey"}
            onChangeText={(text) => {
              setReg(text);
            }}
            style={style.input}
          />

          <View style={style.buttonRow}>
            <Button
            testID="btnlots"
              disabled={reg.length == 0}
              title="Add"
              onPress={() => {
                if (reg.length) {
                  setLotsList(
                    lotsList.map((lot) => {
                      return lot.id == currentLot
                        ? {
                            ...lot,
                            free: false,
                            reg: reg,
                            start: new Date(),
                          }
                        : lot;
                    })
                  );
                  setShowAddModal(false);
                }
              }}
            />
            <Button
              testID="cancel2btn"
              title="Cancel"
              onPress={() => {
                setShowAddModal(false);
              }}
            />
          </View>
        </View>
      </Modal>
      {/* Remove Modal */}
      <Modal
        testID="hrsmodal"
        visible={showRemoveModal}
        onShow={() => {
          calculateHrsAmt();
        }}
        animationType="slide"
      >
        <View style={style.modal}>
          <Text>Pay and Remove Vehicle from P{currentLot}</Text>
          <Text>Total hours: {hrs}</Text>
          <Text>Total Amount:{amnt}</Text>

          <View style={style.buttonRow}>
            <Button
              testID="removebtn"
              title="Remove"
              onPress={() => {
                const flag = false;
                axios
                  .post("https://httpstat.us/200", {
                    car_registration: regid,
                    charge: amnt,
                  })
                  .then((res: any) => {
                    console.log(res);
                  });
                setLotsList(
                  lotsList.map((lot) => {
                    return lot.id === currentLot
                      ? {
                          ...lot,
                          free: true,
                          reg: "",
                          start: new Date(0, 0, 0),
                        }
                      : lot;
                  })
                );
                setAmnt(0);
                setHrs(0);
                setShowRemoveModal(false);
              }}
            />
            <Button
              testID="cancelbtn"
              title="Cancel"
              onPress={() => {
                setAmnt(0);
                setHrs(0);
                setShowRemoveModal(false);
              }}
            />
          </View>
        </View>
      </Modal>

      <TouchableOpacity testID="handletouch" onPress={() => handleAdd(true)} style={style.lots}>
        <FlatList
        
          data={lotsList}
          horizontal={false}
          numColumns={4}
          renderItem={({ item }) => (
            <TouchableOpacity
              testID="touchevent"
              // style={style.layout}
              onPress={() => {
                setCurrentLot(item.id);
                item.free ? handleAdd(false) : handleRemove(item.reg);
              }}
            >
              <View
                style={{
                  ...style.item,
                  backgroundColor: item.free ? "blue" : "red",
                  width: "50px",
                  height: "50px",
                  margin: "10px",
                }}
              >
                <Text style={style.itemText}>P{item.id}</Text>
                <Text style={style.itemText}>
                  {item.free ? "Free" : `Occupied by ${item.reg}`}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Lots;