import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";

import Types "types";

module {
  private type Map<K, V> = TrieMap.TrieMap<K, V>;

  public type State = {
    profiles : Map<Principal, Types.Profile>;
    proposals : Map<Text, Types.Proposal>;
    transactions : Map<Text, Types.TxRecord>;
    userAgreements : Map<Principal, Types.UserAgreement>;
    characterClasses : Map<Text, Types.CharacterClass>;
    characters : Map<Text, Types.Character>;
    characterTakeChoices : Map<Text, Types.CharacterTakeChoice>;
    quests : Map<Text, Types.Quest>;
    questItems : Map<Text, Types.QuestItem>;
    questItemForQuests : Map<Text, Types.QuestItemForQuest>;
    events : Map<Text, Types.Event>;
    choices : Map<Text, Types.Choice>;
    gears : Map<Text,Types.Gear>;
    gearClasses : Map<Text,Types.GearClass>;
    gearRarities : Map<Text, Types.GearRarity>;
    gearSubstats : Map<Text, Types.GearSubstat>;
    materials : Map<Text, Types.Material>;
    inventories : Map<Text, Types.Inventory>;
  };

  public func empty() : State {
    {
      profiles = TrieMap.TrieMap<Principal, Types.Profile>(Principal.equal, Principal.hash);
      proposals = TrieMap.TrieMap<Text, Types.Proposal>(Text.equal, Text.hash);
      transactions = TrieMap.TrieMap<Text, Types.TxRecord>(Text.equal, Text.hash);
      userAgreements = TrieMap.TrieMap<Principal, Types.UserAgreement>(Principal.equal, Principal.hash);
      characterClasses = TrieMap.TrieMap<Text, Types.CharacterClass>(Text.equal, Text.hash);
      characters = TrieMap.TrieMap<Text, Types.Character>(Text.equal, Text.hash);
      characterTakeChoices = TrieMap.TrieMap<Text, Types.CharacterTakeChoice>(Text.equal, Text.hash);
      quests = TrieMap.TrieMap<Text, Types.Quest>(Text.equal, Text.hash);
      questItems = TrieMap.TrieMap<Text, Types.QuestItem>(Text.equal, Text.hash);
      questItemForQuests = TrieMap.TrieMap<Text, Types.QuestItemForQuest>(Text.equal, Text.hash);
      events = TrieMap.TrieMap<Text, Types.Event>(Text.equal, Text.hash);
      choices = TrieMap.TrieMap<Text, Types.Choice>(Text.equal, Text.hash);
      gears = TrieMap.TrieMap<Text, Types.Gear>(Text.equal, Text.hash);
      gearClasses = TrieMap.TrieMap<Text, Types.GearClass>(Text.equal, Text.hash);
      gearRarities = TrieMap.TrieMap<Text, Types.GearRarity>(Text.equal, Text.hash);
      gearSubstats = TrieMap.TrieMap<Text, Types.GearSubstat>(Text.equal, Text.hash);
      materials = TrieMap.TrieMap<Text, Types.Material>(Text.equal, Text.hash);
      inventories = TrieMap.TrieMap<Text, Types.Inventory>(Text.equal, Text.hash);
    };
  };
};