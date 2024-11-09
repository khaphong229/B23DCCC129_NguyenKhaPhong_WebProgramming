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
import { todoService } from "../../api/ToDo";
import moment from "moment";

const { Option } = Select;

function TodoList() {
  const [toDo, setToDo] = useState({});
  const [listToDo, setListToDo] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoService.getAllTodos();
      setListToDo(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách công việc");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await todoService.updateTodo(id, { status: newStatus });
      fetchTodos();
      message.success("Cập nhật trạng thái thành công");
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại");
    }
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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const todoData = {
        ...values,
        date: values.date.format("DD/MM/YYYY"),
      };

      if (isAdding) {
        await todoService.createTodo(todoData);
        message.success("Thêm công việc thành công");
      } else {
        await todoService.updateTodo(toDo._id, todoData);
        message.success("Cập nhật công việc thành công");
      }

      setIsModalVisible(false);
      fetchTodos();
    } catch (error) {
      if (error.errorFields) {
        console.log("Validate Failed:", error);
      } else {
        message.error(
          isAdding ? "Thêm công việc thất bại" : "Cập nhật công việc thất bại"
        );
      }
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa công việc này?",
      async onOk() {
        try {
          await todoService.deleteTodo(id);
          message.success("Xóa công việc thành công");
          fetchTodos();
        } catch (error) {
          message.error("Xóa công việc thất bại");
        }
      },
    });
  };

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
          value={record.status}
          style={{ width: 140 }}
          onChange={(value) => handleStatusChange(record._id, value)}
        >
          <Option value="pending">
            <Tag color="gold">Đang chờ</Tag>
          </Option>
          <Option value="in-progress">
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
      render: (text) => {
        const categoryColors = {
          study: "blue",
          work: "green",
          personal: "purple",
          health: "red",
          leisure: "orange",
        };
        return <Tag color={categoryColors[text]}>{text}</Tag>;
      },
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
            onClick={() => handleDelete(record._id)}
            danger
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

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
        <Table
          columns={columns}
          dataSource={listToDo}
          rowKey="_id"
          loading={loading}
        />
        <Modal
          title={isAdding ? "Thêm công việc" : "Cập nhật công việc"}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
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
