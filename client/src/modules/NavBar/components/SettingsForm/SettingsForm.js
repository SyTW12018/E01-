import React, { Component } from 'react';
import axios from 'axios';
import { AuthConsumer } from 'react-check-auth';
import {
  Modal, Button, Message, Grid, Header, Icon, Container, Divider, List, Dropdown
} from 'semantic-ui-react';
import { Form } from 'formsy-semantic-ui-react';
import '../Form.css';
import PropTypes from 'prop-types';


class NestedModal extends Component {
  static propTypes = {
    refreshAuth: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      isValid: false,
      isLoading: false,
      errors: [],
    };

    this.form = null;
    this.refreshAuth = props.refreshAuth;
  }

  render() {
    const {
      isModalOpen, isValid, isLoading, errors,
    } = this.state;

    return (
      <Modal
        trigger={<Button fluid color='orange' onClick={() => this.setState({ isModalOpen: true })} ><Icon size='small' name='pencil' />Edit Profile</Button>}
        open={isModalOpen}
        onClose={() => this.setState({ isModalOpen: false, errors: [] })}
        size='tiny'
        closeIcon
      >

        <Modal.Content>
          <Grid verticalAlign='middle'>
            <Grid.Column>
              <Header textAlign='center' size='large'>
                <Icon name='weixin' />
                Edit profile
              </Header>

              <Divider />

              <Form
                warning
                size='large'
                loading={isLoading}
                onValidSubmit={this.register}
                onValid={() => this.setState({ isValid: true })}
                onInvalid={() => this.setState({ isValid: false })}
                ref={(ref) => { this.form = ref; }}
              >

                <Form.Input
                  className='hiddenLabel'
                  name='username'
                  fluid
                  required
                  icon='user'
                  iconPosition='left'
                  placeholder='New Username'
                  validations={{
                    isAlphanumeric: true,
                    minLength: 3,
                    maxLength: 25,
                  }}
                  errorLabel={<Message warning />}
                  validationErrors={{
                    isAlphanumeric: 'Enter a valid username',
                    minLength: 'The username must have a length between 3 and 25',
                    maxLength: 'The username must have a length between 3 and 25',
                    isDefaultRequiredValue: 'Username is required',
                  }}
                />

                <Form.Input
                  className='hiddenLabel'
                  name='newpassword'
                  fluid
                  required
                  icon='lock'
                  iconPosition='left'
                  placeholder='New Password'
                  type='password'
                  validations={{
                    minLength: 5,
                    maxLength: 40,
                  }}
                  errorLabel={<Message warning />}
                  validationErrors={{
                    minLength: 'The password must have a length between 5 and 40',
                    maxLength: 'The password must have a length between 5 and 40',
                    isDefaultRequiredValue: 'Password is required',
                  }}
                />
                

                <Form.Input
                  className='hiddenLabel'
                  name='passwordRepeat'
                  fluid
                  required
                  icon='lock'
                  iconPosition='left'
                  placeholder='Repeat password'
                  type='password'
                  validations='equalsField:newpassword'
                  errorLabel={<Message warning />}
                  validationErrors={{
                    isDefaultRequiredValue: 'Password is required',
                    equalsField: 'Passwords doesn\'t match',
                  }}
                />


                <Form.Input
                  className='hiddenLabel'
                  name='password'
                  fluid
                  required
                  icon='lock'
                  iconPosition='left'
                  placeholder='Confirm Password'
                  type='password'
                  errorLabel={<Message warning />}
                  validationErrors={{
                    isDefaultRequiredValue: 'Password is required',
                  }}
                />

                { errors.length > 0 ? (
                  <Message
                    negative
                    header="Can't create a new account!"
                    list={errors}
                  />
                ) : (null)}

                <Divider />

                <Container fluid>
                  <Button
                    fluid
                    size='large'
                    color='orange'
                    content='Confirm Changes'
                    disabled={!isValid || isLoading}
                  />
                </Container>

              </Form>

            </Grid.Column>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}
export default class SettingsForm extends Component {
  static propTypes = {
    refreshAuth: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      isValid: false,
      isLoading: false,
      errors: [],
    };

    this.form = null;
    this.refreshAuth = props.refreshAuth;
  }


  UserInfo = userInfo => (
    <Container fluid>
      <Header>
        <List divided verticalAlign='middle'>
          <List.Item>
            <Icon size='large' name='user' />
            <List.Content>{` ${userInfo.name}`}</List.Content>
          </List.Item>

          <List.Item>
            <Icon size='large' name='mail' />
            <List.Content>{` ${userInfo.email}`}</List.Content>
          </List.Item>
      
          <List.Item>
            <Icon size='large' name='lock' />
            <List.Content>Password</List.Content>
          </List.Item>
        </List>
      </Header>
    </Container>
  );

  render() {
    const {
      isModalOpen,
    } = this.state;


    return (
      <Modal
        trigger={<Dropdown.Item text='Account' icon='cog' onClick={() => this.setState({ isModalOpen: true })} />}
        open={isModalOpen}
        onClose={() => this.setState({ isModalOpen: false, errors: [] })}
        size='tiny'
        closeIcon
      >

        <Modal.Content>
          <Grid verticalAlign='middle'>
            <Grid.Column>
              <Header textAlign='center' size='large'>
                <Icon name='weixin' />
                My Profile
              </Header>
                <AuthConsumer>
                  {({ userInfo }) => (userInfo ? this.UserInfo(userInfo) : null)}
                </AuthConsumer>
            </Grid.Column>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Container fluid>
            <NestedModal />
          </Container>
        </Modal.Actions>
      </Modal>

    );
  }
}