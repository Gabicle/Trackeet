import {useState, useEffect} from "react";
import {deleteUser, getAllUsers} from "./client";
import {Layout, Menu, Breadcrumb, Table, Spin, Empty, Button, Badge, Tag, Avatar, Popconfirm, Radio} from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined, LoadingOutlined, DownloadOutlined, PlusOutlined,
} from '@ant-design/icons';

import UserDrawerForm from "./UserDrawerForm";
import './App.css';
import {errorNotification, successNotification} from "./Notification";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;
const TheAvatar = ({name}) => {
    const trim = name.trim();
    if (trim.length === 0) {
        return <Avatar icon={UserOutlined}/>
    }
    const split = trim.split(" ");
    if (split.length === 1) {
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>{`${name.charAt(0)}${name.charAt(name.length - 1)}`}</Avatar>
};

const removeUser = (userId, callback) => {
    deleteUser(userId).then(() => {
        successNotification("User deleted", `User with ${userId} deleted`);
        callback();
    }).catch(err => {
        err.response.json().then(res => {
            console.log(res);
            errorNotification("There was an issue", `${res.message} [statusCode: ${res.status}]`);

        });
    })
}

const columns = fetchStudents => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, user) => <TheAvatar name={user.name}/>
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },

    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },

    {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (text, user) =>
            <Radio.Group>
                <Popconfirm
                    placement='topRight'
                    title={`Are you sure to delete ${user.name}`}
                    onConfirm={() => removeUser(user.id, fetchStudents)}
                    okText="Yes"
                    cancelText="No">
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm>
                <Radio.Button value="small">Edit</Radio.Button>

            </Radio.Group>


    }
];

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;


function App() {
    const [users, setUsers] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);


    const fetchUsers = () =>
        getAllUsers()
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setFetching(false);
            }).catch(err => {
            err.response.json().then(res => {
                errorNotification("There was an issue", `${res.message} [statusCode: ${res.status}]`);
            });
        }).finally(() => setFetching(false));

    useEffect(() => {
        console.log("Mounted");
        fetchUsers();
    }, []);

    const renderUsers = () => {
        if (fetching) {
            return <Spin indicator={antIcon}/>
        }
        if (users.length <= 0) {
            return <>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                    Add New User
                </Button>
                <UserDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchUsers={fetchUsers}
                />
            <Empty/>;

            </>
        }
        return <>
            <UserDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchUsers={fetchUsers}
            />
            <Table
                dataSource={users}
                columns={columns(fetchUsers)}
                bordered
                title={() =>
                    <>
                        <Tag style={{marginLeft: "5px"}}>Number of Users</Tag>
                        <Badge count={users.length} className="site-badge-count-4"/>
                        <br/> <br/>
                        <Button
                            onClick={() => setShowDrawer(!showDrawer)}
                            type="primary" shape="round" icon={<PlusOutlined/>} size="small"> Add new
                            User </Button>

                    </>
                }
                pagination={{pageSize: 50}}
                scroll={{y: 240}}
                rowKey={(user) => user.id}
            />;
        </>

    }

    return <Layout style={{minHeight: '100vh'}}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div className="logo"/>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined/>}>
                    Option 1
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined/>}>
                    Option 2
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined/>} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined/>} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined/>}>
                    Files
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background" style={{padding: 0}}/>
            <Content style={{margin: '0 16px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                    {renderUsers()}
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>Trackeet ©2021 Created by Gabicle</Footer>
        </Layout>
    </Layout>


}

export default App;
