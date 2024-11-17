import React, { useState } from 'react';
import { Table, Row } from 'react-native-table-component';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
} from 'react-native';

// Utility function to revive dates in JSON
const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');
function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

// GraphQL Fetch function
async function graphQLFetch(query, variables = {}) {
  try {
    /****** Q4: Start Coding here. State the correct IP/port******/
    const response = await fetch('http://10.0.2.2:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    /****** Q4: Code Ends here******/
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

// Styling for app
const styles = StyleSheet.create({
  appTitle: {
    backgroundColor: '#3187bd', 
    paddingVertical: 15,
    textAlign: 'center',
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionContainer: {
    // marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#fff',
    // borderRadius: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 8,
    marginVertical: 8,
  },
  container: { 
    flex: 1, 
    padding: 16, 
    paddingTop: 30, 
    backgroundColor: '#fff' 
  },
  header: {
    height: 50,
    backgroundColor: '#3187bd',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  headerText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: '600' 
  },
  dataWrapper: { 
    marginTop: -1 
  },
  row: {
    height: 40,
    backgroundColor: '#f2fafc', 
  },
  rowText: {
    textAlign: 'center',
    fontWeight: '400',
    color: '#1A237E',
  },
});

// Width configuration for each column
const width = [40, 80, 80, 80, 80, 80, 200];

// Components

// IssueFilter component
class IssueFilter extends React.Component {
  render() {
    return (
      <>
        {/****** Q1: Start Coding here. ******/}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Filter Issues</Text>
          <TextInput
            placeholder="Enter filter keyword"
            style={styles.input}
          />
          <Button
            title="Apply Filter"
            onPress={() => { /* Placeholder */ }}
          />
        </View>
        {/****** Q1: Code ends here ******/}
      </>
    );
  }
}

// IssueRow component for displaying each row in the table
function IssueRow(props) {
  const issue = props.issue;
  {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
  const rowData = [
    issue.id.toString(),
    issue.title,
    issue.status,
    issue.owner,
    issue.created.toLocaleDateString(),
    issue.effort ? issue.effort.toString() : '-',
    issue.due ? issue.due.toLocaleDateString() : '-',
  ];
  {/****** Q2: Coding Ends here.******/}

  return (
    <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      <Row
        data={rowData}
        style={styles.row}
        textStyle={styles.rowText}
        widthArr={width}
      />
      {/****** Q2: Coding Ends here. ******/}
    </>
  );
}

// IssueTable component for displaying issues in a table format
function IssueTable(props) {
  const issueRows = props.issues.map(issue => (
    <IssueRow key={issue.id} issue={issue} />
  ));

  {/****** Q2: Start Coding here. Add Logic to initialize table header  ******/}
  const tableHeader = ['ID', 'Title', 'Status', 'Owner', 'Created', 'Effort', 'Due'];
  {/****** Q2: Coding Ends here. ******/}

  return (
    <ScrollView horizontal style={styles.sectionContainer}>
    {/****** Q2: Start Coding here to render the table header/rows.**********/}
      <View>
        <Text style={styles.sectionTitle}>All Issues</Text>
        <Table>
          <Row
            data={tableHeader}
            style={styles.header}
            textStyle={styles.headerText}
            widthArr={width}
          />
          {issueRows}
        </Table>
      </View>
    {/****** Q2: Coding Ends here. ******/}
    </ScrollView>
  );
}

// IssueAdd component for adding new issues
class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q3: Start Coding here. Create State to hold inputs******/
    this.state = {
      title: '',
      owner: '',
      effort: '',
      due: ''
    };
    /****** Q3: Code Ends here. ******/
  }

  /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
  setTitle(title) {
    this.setState({ title });
  }
  setOwner(owner) {
    this.setState({ owner });
  }
  setEffort(effort) {
    this.setState({ effort });
  }
  setDue(due) {
    this.setState({ due });
  }
  /****** Q3: Code Ends here. ******/
  
  handleSubmit() {
    /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
    const issue = {
      title: this.state.title,
      owner: this.state.owner,
      effort: parseInt(this.state.effort, 10),
      due: new Date(this.state.due)
    };
    
    this.props.createIssue(issue);

    // Clear input fields
    this.setState({
      title: '',
      owner: '',
      effort: '',
      due: ''
    });
    /****** Q3: Code Ends here. ******/
  }

  render() {
    return (
      
      <View style={styles.sectionContainer}>
        {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <Text style={styles.sectionTitle}>Add Issue</Text>
        <TextInput
          placeholder="Title"
          value={this.state.title}
          onChangeText={(text) => this.setTitle(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Owner"
          value={this.state.owner}
          onChangeText={(text) => this.setOwner(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Effort"
          value={this.state.effort}
          keyboardType="numeric"
          onChangeText={(text) => this.setEffort(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Due Date (DD--MM--YYYY)"
          value={this.state.due}
          onChangeText={(text) => this.setDue(text)}
          style={styles.input}
        />
        <Button title="Add Issue" onPress={this.handleSubmit} />
        {/****** Q3: Code Ends here. ******/}
      </View>
    );
  }
}

// BlackList component for adding a user to blacklist
class BlackList extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q4: Start Coding here. Create State to hold inputs******/
    this.state = { name: '' };
    /****** Q4: Code Ends here. ******/
  }

  /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
  setName(newName) {
    this.setState({ name: newName });
  }
  /****** Q4: Code Ends here. ******/

  async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
    const query = `mutation addToBlacklist($nameInput: String!) {
      addToBlacklist(nameInput: $nameInput)
    }`;

    const { name } = this.state;
    
    const data = await graphQLFetch(query, { nameInput: name });
    if (data) {
      alert(`${name} added to blacklist.`);
      this.setState({ name: '' });
    }
    /****** Q4: Code Ends here. ******/
  }

  render() {
    return (
      <View style={styles.sectionContainer}>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <Text style={styles.sectionTitle}>Blacklist</Text>
        <TextInput
          placeholder="Name to Blacklist"
          value={this.state.name}
          onChangeText={(text) => this.setName(text)}
          style={styles.input}
        />
        <Button title="Add to Blacklist" onPress={this.handleSubmit} />
        {/****** Q4: Code Ends here. ******/}
      </View>
    );
  }
}

// Main IssueList component to combine all components
export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
      issueList {
        id title status owner
        created effort due
      }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
      issueAdd(issue: $issue) {
        id
      }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
      this.loadData();
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f4f4' }}>
        <StatusBar barStyle="dark-content" />

        <Text style={styles.appTitle}>Issue Tracker IT5007</Text>

        <View style={{ flex: 1, padding: 8 }}>
          <ScrollView contentInsetAdjustmentBehavior="automatic">

            {/****** Q1: Start Coding here. ******/}
            <IssueFilter />
            {/****** Q1: Code ends here ******/}

            {/****** Q2: Start Coding here. ******/}
            <IssueTable issues={this.state.issues} />
            {/****** Q2: Code ends here ******/}

            {/****** Q3: Start Coding here. ******/}
            <IssueAdd createIssue={this.createIssue} />
            {/****** Q3: Code Ends here. ******/}

            {/****** Q4: Start Coding here. ******/}
            <BlackList />
            {/****** Q4: Code Ends here. ******/}

          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

}
