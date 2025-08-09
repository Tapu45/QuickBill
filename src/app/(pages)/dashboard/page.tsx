'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { ArrowUp, ArrowDown, Gauge, CurrencyDollar, ShoppingCart, Users, Clock, ChartLine } from '@phosphor-icons/react'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement)

const Dashboard = () => {
  // Sample data for the charts
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [3200, 4100, 3800, 5200, 4800, 6100],
        borderColor: 'var(--color-chart-1)',
        backgroundColor: 'rgba(99, 102, 241, 0.15)', // fallback for chart fill
        tension: 0.3,
      },
    ],
  }

  const expenseData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Expenses',
        data: [2400, 2100, 2600, 3000, 2800, 3200],
        backgroundColor: 'var(--color-chart-2)',
      },
    ],
  }

  const customerData = {
    labels: ['New', 'Returning', 'Inactive'],
    datasets: [
      {
        label: 'Customers',
        data: [300, 450, 100],
        backgroundColor: [
          'var(--color-chart-3)',
          'var(--color-chart-1)',
          'var(--color-chart-4)',
        ],
        borderColor: [
          'var(--color-chart-3)',
          'var(--color-chart-1)',
          'var(--color-chart-4)',
        ],
        borderWidth: 2,
      },
    ],
  }

  // Sample stats data
  const stats = [
    { 
      title: 'Total Revenue', 
      value: '$24,580', 
      change: '+14.2%', 
      isPositive: true,
      icon: <CurrencyDollar size={24} weight="fill" style={{ color: 'var(--color-primary)' }} />
    },
    { 
      title: 'Total Sales', 
      value: '1,463', 
      change: '+7.4%', 
      isPositive: true,
      icon: <ShoppingCart size={24} weight="fill" style={{ color: 'var(--color-accent)' }} />
    },
    { 
      title: 'Active Users', 
      value: '8,249', 
      change: '+24.5%', 
      isPositive: true,
      icon: <Users size={24} weight="fill" style={{ color: 'var(--color-chart-3)' }} />
    },
    { 
      title: 'Avg. Session', 
      value: '4m 32s', 
      change: '-2.3%', 
      isPositive: false,
      icon: <Clock size={24} weight="fill" style={{ color: 'var(--color-destructive)' }} />
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="p-6 min-h-screen" style={{ background: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      {/* Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-card-foreground)' }}>Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your business.</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            className="rounded-xl shadow-md p-5 border"
            style={{
              background: 'var(--color-card)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-card-foreground)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-muted-foreground">{stat.title}</span>
              {stat.icon}
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span
                className={`flex items-center text-sm`}
                style={{
                  color: stat.isPositive ? 'var(--color-chart-3)' : 'var(--color-destructive)'
                }}
              >
                {stat.isPositive ? <ArrowUp weight="bold" /> : <ArrowDown weight="bold" />}
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div 
          className="p-5 rounded-xl shadow-md border"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-card-foreground)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <span className="flex items-center text-sm font-medium" style={{ color: 'var(--color-chart-3)' }}>
              <ArrowUp weight="bold" className="mr-1" />
              +12.5% from last month
            </span>
          </div>
          <Line 
            data={revenueData} 
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: { beginAtZero: true }
              }
            }} 
          />
        </motion.div>

        <motion.div 
          className="p-5 rounded-xl shadow-md border"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-card-foreground)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Expense Breakdown</h2>
            <ChartLine size={20} weight="fill" style={{ color: 'var(--color-accent)' }} />
          </div>
          <Bar 
            data={expenseData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              }
            }} 
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="p-5 rounded-xl shadow-md border col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            background: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-card-foreground)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Customer Segments</h2>
            <Users size={20} weight="fill" style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="flex justify-center">
            <div className="w-48">
              <Doughnut 
                data={customerData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="p-5 rounded-xl shadow-md border col-span-1 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            background: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-card-foreground)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Performance Metrics</h2>
            <Gauge size={20} weight="fill" style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-chart-1)', color: 'var(--color-card-foreground)' }}>
              <div className="text-sm mb-1 font-medium" style={{ color: 'var(--color-primary-foreground)' }}>Conversion Rate</div>
              <div className="text-2xl font-bold">24.8%</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-primary-foreground)' }}>+2.2% from last month</div>
              <div className="w-full rounded-full h-1.5 mt-2" style={{ background: 'var(--color-chart-2)' }}>
                <div className="h-1.5 rounded-full" style={{ background: 'var(--color-primary)', width: "75%" }}></div>
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-chart-3)', color: 'var(--color-card-foreground)' }}>
              <div className="text-sm mb-1 font-medium" style={{ color: 'var(--color-primary-foreground)' }}>Avg. Order Value</div>
              <div className="text-2xl font-bold">$96.20</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-primary-foreground)' }}>+5.3% from last month</div>
              <div className="w-full rounded-full h-1.5 mt-2" style={{ background: 'var(--color-chart-2)' }}>
                <div className="h-1.5 rounded-full" style={{ background: 'var(--color-accent)', width: "68%" }}></div>
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-chart-4)', color: 'var(--color-card-foreground)' }}>
              <div className="text-sm mb-1 font-medium" style={{ color: 'var(--color-primary-foreground)' }}>Return Rate</div>
              <div className="text-2xl font-bold">3.2%</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-primary-foreground)' }}>-0.5% from last month</div>
              <div className="w-full rounded-full h-1.5 mt-2" style={{ background: 'var(--color-chart-2)' }}>
                <div className="h-1.5 rounded-full" style={{ background: 'var(--color-destructive)', width: "15%" }}></div>
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-chart-5)', color: 'var(--color-card-foreground)' }}>
              <div className="text-sm mb-1 font-medium" style={{ color: 'var(--color-primary-foreground)' }}>Growth Rate</div>
              <div className="text-2xl font-bold">18.6%</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-primary-foreground)' }}>+1.2% from last month</div>
              <div className="w-full rounded-full h-1.5 mt-2" style={{ background: 'var(--color-chart-2)' }}>
                <div className="h-1.5 rounded-full" style={{ background: 'var(--color-primary)', width: "60%" }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
export default Dashboard