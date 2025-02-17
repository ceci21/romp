import React from 'react';
import { connect } from 'react-redux';
import FriendList from './FriendList';
import { Grid, Image, Segment, Button, Card, Icon } from 'semantic-ui-react';
import { getEvent, toggleProfileSettingsModal, addFriend, getFriends } from '../actions/index.js';
import { Link, browserHistory } from 'react-router';
import ProfileSettingsModal from './ProfileSettingsModal';
import FriendCard from './FriendCard';

// import ProfileSettingsModal from './ProfileSettingsModal';
import '../styles/UserPage.css';

import axios from 'axios';
const ROOT_URL = `http://localhost:3001`;
// const ROOT_URL = 'http://localhost:3001';
// console.log('process.env.HOST: ', process.env.HOST);

const fillerImage = 'http://www.fillmurray.com/300/200';

class UserPage extends React.Component {
  constructor(props) {
    console.log('user page', props);
    super(props);
    this.state = {
      user: null,
      friends: [],
      isAdmin: false,
      description: null,
      editingDescription: false
    };
  }

  addThisFriend = () => {
    let userID = this.state.user._id;
    let curUserID = this.props.user._id;
    let curUser = this.props.user;
    this.props.addFriend({ userID, curUserID }, () => {
      this.props.getFriends(curUser, () => {
        console.log(this.state.user.username, 'added to your friends list!');
      });
    });
  };

  displayFriends = () => {
    let friends = this.props.friends ? this.props.friends : this.props.user.friends;
    return friends.map((user, index) => {
      // let friend = user;
      // let profilePic = user.profilePicURL;
      return <FriendList key={user.id} index={index} friend={user} curUserPage={this.state.user} />;
      return <FriendCard key={user.id} index={index} friend={user} />;
      //   <span style={{ margin: '2px' }}>
      //     <Link to={`${ROOT_URL}/user/${user._id}`}>
      //       <img width="100" height="100" src={profilePic} />
      //     </Link>
      //     <p>{friend.username}</p>
      //   </span>
      // );
    });
  };

  displayTheirFriends = () => {
    let friends = this.state.user.friends;
    return friends.map((user, index) => {
      return <FriendList key={user.id} index={index} friend={user} curUserPage={this.state.user} />;
    });
  };

  componentWillMount() {
    this.getUser();
    getFriends();
  }

  getUser = async () => {
    let user = (await axios.get(`${ROOT_URL}/users/${this.props.routeParams.username}`)).data;
    this.setState({ user });
  };

  setDescription = e => {
    let user = Object.assign({}, this.state.user);
    user.description = e.target.value;
    this.setState({ user });
  };

  sendDescription = () => {
    this.setState({ editingDescription: false });
    // post to server the new description
    console.log(this.state.user.description);
    axios.post(`${ROOT_URL}/updateUser`, { user: this.state.user });
  };

  render() {
    console.log('Current user selected: ', this.state.user);
    if (this.state.user) {
      let { user } = this.state;
      let curUserID = this.props.user.username;
      let profileId = this.props.routeParams.username;
      let userID = this.state.user.username;
      console.log(curUserID === profileId)
      return (
        <div>
          {/* <Segment>
            <Grid>
              <Grid.Row>
                <Grid.Column width={3}>
                  <div>
                    <h2>{user.username}</h2>
                  </div>
                  <div>
                    <img width="200" height="200" src={user.profilePicURL} />
                  </div>
                </Grid.Column>
                <Grid.Column width={13}>{`${user.firstName} ${user.lastName}`}</Grid.Column>
                <Grid.Column width={1}>
                  {this.props.friends.find(user => user._id === userID) ? (
                    <Button disabled="true" color="green">
                      Friends
                    </Button>
                  ) : (
                    <Button onClick={this.addThisFriend}>Add Friend</Button>
                  )}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <h2>Friends</h2>
                  {curUserID === user._id ? this.displayFriends() : this.displayTheirFriends()}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment> */}
          <div className="UserPage-container">
            <ProfileSettingsModal user={this.state.user} />
            <div className="UserPage-user-blurb">
              <div className="UserPage-profile-picture">
                <div>
                  <img className="profile-picture" src={user.profilePicURL} />
                  {(curUserID === profileId) ? <img
                    className="edit-profile-picture"
                    src="https://png.icons8.com/ultraviolet/540//plus.png"
                    onClick={() => {
                      this.props.toggleProfileSettingsModal(true);
                    }}
                  />: null }
                  <div>
                  {this.props.friends.find(user => user._id === userID) ? (
                    <Button disabled="true" color="green">
                      Friends
                    </Button>
                  ) : (
                    <Button onClick={this.addThisFriend}>Add Friend</Button>
                  )}
                  </div>
                </div>
              </div>
              <div className="UserPage-user-info">
                <div className="UserPage-user-name">
                  <h2>{user.username}</h2>
                </div>
                <div className="UserPage-user-description">
                  {(() => {
                    if (this.state.editingDescription) {
                      return (
                        <textarea
                          autoFocus
                          value={user.description}
                          onChange={this.setDescription}
                          onBlur={this.sendDescription}
                        />
                      );
                    } else {
                      return user.description !== '' ? (
                        <span>
                          <h5>“</h5>
                          <p>{user.description}</p>
                          <h5>”</h5>
                        </span>
                      ) : (
                        <p>No description available.</p>
                      );
                    }
                  })()}
                </div>
                  {(curUserID === profileId) ? <div className="UserPage-edit-description" onClick={() => { this.setState({ editingDescription: true }) }}><Icon name="edit" /><p style={{ display: 'inline-block' }}>Edit description</p></div> : null }
              </div>
              <div>{curUserID === user._id ? this.displayFriends() : this.displayTheirFriends()}</div>
            </div>
          </div>
        </div>
      );
    } else {
      return <Segment>Loading...</Segment>;
    }
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, { getEvent, toggleProfileSettingsModal, addFriend, getFriends })(UserPage);

const styles = {
  descriptionInput: {
    border: 'none'
  }
};
