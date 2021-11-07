// UserDrawerForm.js

import {Drawer, Input, Col, Select, Form, Row, Button, Spin} from 'antd';
import {addNewUser} from "./client";
import {LoadingOutlined} from "@ant-design/icons";
import {useState} from "react";
import {successNotification, errorNotification} from "./Notification";


const {Option} = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;



function UserDrawerForm({showDrawer, setShowDrawer, fetchUsers}) {
    const onCLose = () => setShowDrawer(false);
    const [submitting, setSubmitting] = useState(false);

    const onFinish = user => {
        setSubmitting(true);
        console.log(JSON.stringify(user, null, 2));
        addNewUser(user).then(() => {
            console.log("user added");
            onCLose();
            successNotification("User added", `${user.name} was added to system`)
            fetchUsers();
        }).catch(err => {
            console.log(err);
            err.response.json().then(res =>{
                errorNotification("There was an issue", `${res.message} [statusCode: ${res.status}]`, "bottomLeft");

            });
        }).finally(() =>{
            setSubmitting(false);
        })
    };

    const onFinishFailed = errorInfo => {
        alert(JSON.stringify(errorInfo, null, 2));
    };

    return <Drawer
        title="Create new user"
        width={720}
        onClose={onCLose}
        visible={showDrawer}
        bodyStyle={{paddingBottom: 80}}
        footer={
            <div
                style={{
                    textAlign: 'right',
                }}
            >
                <Button onClick={onCLose} style={{marginRight: 8}}>
                    Cancel
                </Button>
            </div>
        }
    >
        <Form layout="vertical"
              onFinishFailed={onFinishFailed}
              onFinish={onFinish}
              hideRequiredMark>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{required: true, message: 'Please enter user name'}]}
                    >
                        <Input placeholder="Please enter user name"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{required: true, message: 'Please enter user email'}]}
                    >
                        <Input placeholder="Please enter user email"/>
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{required: true, message: 'Please enter user password'}]}
                    >
                        <Input placeholder="Please enter user password"/>
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Col span={12}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                {submitting && <Spin indicator={antIcon} />}
            </Row>
        </Form>
    </Drawer>
}

export default UserDrawerForm;