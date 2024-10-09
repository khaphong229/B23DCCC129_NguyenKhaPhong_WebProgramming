import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ToDoLayout from "../../layouts/ToDoLayout/index";
import { DEFAULT_TASK } from "../../services/defaultTask";
import moment from "moment";

const { Option } = Select;

function TodoList() {
  const [toDo, setToDo] = useState({});
  const [listToDo, setListToDo] = useState(DEFAULT_TASK);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Công việc",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "date",
      key: "date",
      render: (text, record) => {
        const dueDate = moment(text, "DD/MM/YYYY");

        const isOverdue = moment().isAfter(dueDate);

        return (
          <span style={{ color: isOverdue ? "red" : "inherit" }}>
            {text}
            {isOverdue && (
              <ExclamationCircleOutlined
                style={{ marginLeft: 8, color: "red" }}
              />
            )}
          </span>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Select
          defaultValue={record.status}
          style={{ width: 140 }}
          onChange={(value) => handleStatusChange(record.id, value)}
        >
          <Option value="pending">
            <Tag color="gold">Đang chờ</Tag>
          </Option>
          <Option value="in progress">
            <Tag color="blue">Trong tiến trình</Tag>
          </Option>
          <Option value="done">
            <Tag color="green">Hoàn thành</Tag>
          </Option>
        </Select>
      ),
    },
    {
      title: "Tùy chọn",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
          >
            Xóa
          </Button>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      key: "statusIcon",
      render: (_, record) => (
        <span>
          {record.status === "done" ? (
            <CheckCircleOutlined style={{ color: "green" }} />
          ) : (
            <ClockCircleOutlined style={{ color: "orange" }} />
          )}
        </span>
      ),
    },
  ];

  const handleStatusChange = (id, newStatus) => {
    const newList = listToDo.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setListToDo(newList);
    message.success("Cập nhật trạng thái thành công");
  };

  const showModal = (record) => {
    if (record) {
      setToDo(record);
      form.setFieldsValue({
        ...record,
        date: moment(record.date, "DD/MM/YYYY"),
      });
      setIsAdding(false);
    } else {
      setToDo({});
      form.resetFields();
      setIsAdding(true);
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (isAdding) {
          const newTask = {
            id: listToDo.length + 1,
            ...values,
            date: values.date.format("DD/MM/YYYY"),
          };
          setListToDo([...listToDo, newTask]);
          message.success("Công việc được thêm thành công");
        } else {
          const updatedTask = {
            ...toDo,
            ...values,
            date: values.date.format("DD/MM/YYYY"),
          };
          const newList = listToDo.map((item) =>
            item.id === updatedTask.id ? updatedTask : item
          );
          setListToDo(newList);
          message.success("Cập nhật công việc thành công");
        }
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate lỗi ", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa công việc này?",
      onOk() {
        const newList = listToDo.filter((item) => item.id !== id);
        setListToDo(newList);
        message.success("Xóa công việc thành công");
      },
    });
  };

  return (
    <ToDoLayout>
      <div className="formWrap">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          style={{ marginBottom: 16, float: "right" }}
        >
          Thêm công việc
        </Button>
        <Table columns={columns} dataSource={listToDo} rowKey="id" />
        <Modal
          title={isAdding ? "Thêm công việc" : "Cập nhật công việc"}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Công việc"
              rules={[
                { required: true, message: "Vui lòng nhập tên công việc!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="date"
              label="Ngày kết thúc"
              rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
            >
              <DatePicker format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select>
                <Option value="pending">Đang chờ</Option>
                <Option value="in progress">Trong tiến trình</Option>
                <Option value="done">Hoàn thành</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="category"
              label="Tùy chọn"
              rules={[{ required: true, message: "Vui lòng chọn tùy chọn!" }]}
            >
              <Select>
                <Option value="study">Học tập</Option>
                <Option value="work">Làm việc</Option>
                <Option value="personal">Cá nhân</Option>
                <Option value="health">Sức khỏe</Option>
                <Option value="leisure">Rảnh rỗi</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ToDoLayout>
  );
}

export default TodoList;
