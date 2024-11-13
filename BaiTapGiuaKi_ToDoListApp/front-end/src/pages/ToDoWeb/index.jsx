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
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ToDoLayout from "../../layouts/ToDoLayout/index";
import { todoService } from "../../api/ToDo";
import moment from "moment";
import "./styles.css";

const { Option } = Select;
const { Search } = Input;

export default function TodoList() {
  const [toDo, setToDo] = useState({});
  const [listToDo, setListToDo] = useState([]);
  const [filteredToDo, setFilteredToDo] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async (searchText = "") => {
    try {
      setLoading(true);
      const response = await todoService.searchTodos({ search: searchText });
      const formattedTodos = response.data.map((todo) => ({
        ...todo,
        date: todo.date,
      }));

      const sortedTodos = formattedTodos.sort((a, b) => {
        if (a.status === "done" && b.status !== "done") return 1;
        if (a.status !== "done" && b.status === "done") return -1;
        return 0;
      });

      setListToDo(sortedTodos);
      setFilteredToDo(sortedTodos);
    } catch (error) {
      message.error("Không thể tải danh sách công việc");
    } finally {
      setLoading(false);
    }
  };

  const fetchTodoById = async (id) => {
    try {
      setLoading(true);
      const response = await todoService.getTodoById(id);
      return response.data;
    } catch (error) {
      message.error("Không thể tải thông tin công việc");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const filtered = listToDo.filter((todo) =>
      todo.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredToDo(filtered);
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

  const showModal = async (record) => {
    if (record) {
      try {
        const todoData = await fetchTodoById(record._id);
        if (todoData) {
          setToDo(todoData);
          form.setFieldsValue({
            name: todoData.name,
            category: todoData.category,
            status: todoData.status,
            date: moment(todoData.date),
          });
          setIsAdding(false);
        }
      } catch (error) {
        message.error("Không thể tải thông tin công việc");
        return;
      }
    } else {
      setToDo({});
      form.resetFields();
      form.setFieldsValue({
        date: moment(),
        status: "pending",
      });
      setIsAdding(true);
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const todoData = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
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
      icon: <ExclamationCircleOutlined />,
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
      ellipsis: true,
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "date",
      key: "date",
      render: (date) => {
        const dueDate = moment(date);
        const isOverdue = moment().isAfter(dueDate, "day");
        return (
          <span style={{ color: isOverdue ? "red" : "inherit" }}>
            {dueDate.format("DD/MM/YYYY")}
            {isOverdue && (
              <ExclamationCircleOutlined
                style={{ marginLeft: 8, color: "red" }}
                title="Đã quá hạn"
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
          value={text}
          style={{ width: 140 }}
          onChange={(value) => handleStatusChange(record._id, value)}
        >
          <Option value="pending">
            <span className="tag-gold">Đang chờ</span>
          </Option>
          <Option value="in-progress">
            <span className="tag-blue">Trong tiến trình</span>
          </Option>
          <Option value="done">
            <span className="tag-green">Hoàn thành</span>
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
          leisure: "gold",
        };
        return (
          <Tag color={categoryColors[text]}>{`${
            text === "study"
              ? "Học tập"
              : text === "work"
              ? "Công việc"
              : text === "personal"
              ? "Cá nhân"
              : text === "health"
              ? "Sức khỏe"
              : text === "leisure"
              ? "Rảnh rỗi"
              : ""
          }`}</Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
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
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Search
              placeholder="Tìm kiếm công việc..."
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              enterButton={<SearchOutlined />}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={12}
            style={{ textAlign: "right" }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Thêm công việc
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredToDo}
          rowKey="_id"
          loading={loading}
          scroll={{ x: "max-content" }}
          pagination={{
            responsive: true,
            showSizeChanger: true,
          }}
          onChange={(pagination, filters, sorter) => {
            if (sorter.order) {
              const sorted = [...filteredToDo].sort((a, b) => {
                if (a.status === "done" && b.status !== "done") return 1;
                if (a.status !== "done" && b.status === "done") return -1;
                return sorter.order === "ascend"
                  ? a[sorter.field] > b[sorter.field]
                    ? 1
                    : -1
                  : a[sorter.field] < b[sorter.field]
                  ? 1
                  : -1;
              });
              setFilteredToDo(sorted);
            }
          }}
        />

        <Modal
          title={isAdding ? "Thêm công việc" : "Cập nhật công việc"}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
          width="100%"
          style={{ maxWidth: "600px" }}
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
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select>
                <Option value="pending">Đang chờ</Option>
                <Option value="in-progress">Trong tiến trình</Option>
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
