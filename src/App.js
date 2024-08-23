import { useEffect } from "react";
import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [isAddFriend, setIsAddFriend] = useState(false);
  const [showSplitForm, setShowSplitForm] = useState({});
  const [friendList, setFriendList] = useState([]);

  let selectedFrind = {};

  function handleOnClick() {
    setIsAddFriend((prev) => !prev);
  }

  function handleShowSplitForm(friend) {
    console.log("friend >>>>>", friend);
    setShowSplitForm((selected) => (selected.id === friend.id ? {} : friend));
    setIsAddFriend(false);
  }

  function handleAddNewFriend(friend) {
    setFriendList([...friendList, friend]);
    setIsAddFriend(false);
  }

  function handleSplit(splitObj) {
    friendList.forEach((friend) => {
      if (splitObj.payByWho === "You" && friend.id === splitObj.frindId)
        friend.balance += splitObj.friendExpence;
      else if (splitObj.payByWho != "You" && friend.id === splitObj.frindId)
        friend.balance += -splitObj.yourExpence;
    });

    setFriendList([...friendList]);
    setShowSplitForm({});
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          firendList={friendList}
          onHandleShowSplitForm={handleShowSplitForm}
          onShowSplitFrom={showSplitForm}
        />
        {true && (
          <AddFriend
            onIsAddFrind={isAddFriend}
            onAddNewFrined={handleAddNewFriend}
          />
        )}
        <Button handleAction={handleOnClick}>
          {!isAddFriend ? "Add Friend" : "Close"}
        </Button>
      </div>
      <SplitBill
        key={showSplitForm.id}
        onShowSplitForm={showSplitForm}
        onHandleSplit={handleSplit}
      />
    </div>
  );
}

function FriendList({ firendList, onHandleShowSplitForm, onShowSplitFrom }) {
  let friends = firendList;
  return (
    <ul>
      {friends.map((f) => (
        <Friend
          friend={f}
          onHandleShowSplitForm={onHandleShowSplitForm}
          onShowSplitFrom={onShowSplitFrom}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onHandleShowSplitForm, onShowSplitFrom }) {
  let isSelected = friend.id === onShowSplitFrom.id;

  return (
    <li key={friend.id} className={isSelected ? "selected" : ""}>
      <img src={friend.image} />
      <h3>{friend.name}</h3>
      <p
        className={
          friend.balance < 0 ? "red" : friend.balance === 0 ? "" : "green"
        }
      >
        {friend.balance < 0
          ? `Your own ${friend.name} ${Math.abs(friend.balance)}$ `
          : friend.balance === 0
          ? `You and ${friend.name} are even`
          : `${friend.name} own you ${friend.balance}$`}
      </p>
      <Button handleAction={() => onHandleShowSplitForm(friend)} id={friend.id}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function AddFriend({ onIsAddFrind, onAddNewFrined }) {
  const [friendName, setFriendName] = useState("");
  const [imageUrl, setImageUrl] = useState("https://i.pravatar.cc/48?u=118823");

  function handleSubmit(e) {
    e.preventDefault();

    if (!friendName || !imageUrl) return;

    let newFriend = {
      id: crypto.randomUUID(),
      name: friendName,
      image: `https://i.pravatar.cc/48?u=${crypto.randomUUID()}`,
      balance: 0,
    };
    onAddNewFrined(newFriend);

    setFriendName("");
  }

  return (
    <>
      {onIsAddFrind && (
        <form className="form-add-friend" onSubmit={handleSubmit}>
          <label>🤼‍♂️Friend Name</label>
          <input
            type="text"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
          />
          <label>🎏 Image Url</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Button>Add</Button>
        </form>
      )}
    </>
  );
}

function Button({ children, handleAction, id }) {
  return (
    <button className="button" value={id} onClick={handleAction}>
      {children}
    </button>
  );
}

function SplitBill({ onShowSplitForm, onHandleSplit }) {
  const [billValue, setBillValue] = useState("");
  const [expence, setExpence] = useState("");
  let friendExpence = billValue - expence;
  const [payingWho, setPayingWho] = useState("You");

  function handleSubmitSplitBillForm(e) {
    e.preventDefault();
    console.log(
      `all control variables ${billValue}, ${expence} , ${payingWho}`
    );
    if (!billValue || !expence) return;

    const splitBillObj = {
      billValue,
      yourExpence: expence,
      friendExpence,
      payByWho: payingWho,
      frindId: onShowSplitForm.id,
    };

    onHandleSplit(splitBillObj);
  }

  // useEffect(() => {
  //   setBillValue("");
  //   setExpence("");
  //   setPayingWho("You");
  // }, [onShowSplitForm.id]);

  return (
    <>
      {onShowSplitForm.id && (
        <form className="form-split-bill " onSubmit={handleSubmitSplitBillForm}>
          <h2>Split a bill with {onShowSplitForm.name} </h2>
          <label> 💰 Bill value</label>
          <input
            type="text"
            value={billValue}
            onChange={(e) => setBillValue(Number(e.target.value))}
          />
          <label>🧍Your Expences</label>
          <input
            type="text"
            value={expence}
            onChange={(e) => setExpence(Number(e.target.value))}
          />
          <label>🧍‍♀️👧 {onShowSplitForm.name} expence</label>
          <input type="text" disabled value={billValue - expence} />
          <label>🥳 Who is paying the bill</label>
          <select onChange={(e) => setPayingWho(e.target.value)}>
            <option value="you">You</option>
            <option value={onShowSplitForm.id}>{onShowSplitForm.name}</option>
          </select>
          <Button>Split Bill</Button>
        </form>
      )}
    </>
  );
}

export default App;
