package com.udea.bancoudea.service;

import com.udea.bancoudea.DTO.CustomerDTO;
import com.udea.bancoudea.DTO.DashboardStatsDTO;
import com.udea.bancoudea.entity.Customer;
import com.udea.bancoudea.mapper.CustomerMapper;
import com.udea.bancoudea.repository.CustomerRepository;
import com.udea.bancoudea.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;
    private final CustomerMapper customerMapper;

    @Autowired
    public CustomerService(CustomerRepository customerRepository,TransactionRepository transactionRepository, CustomerMapper customerMapper) {
        this.customerRepository = customerRepository;
        this.transactionRepository = transactionRepository;
        this.customerMapper = customerMapper;
    }

    public List<CustomerDTO> getAllCustomer() {
        return customerRepository.findAll().stream()
                .map(customerMapper::toDTO).toList();
    }

    public CustomerDTO getCustomerById(Long id) {
        return customerRepository.findById(id).map(customerMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        Customer customer = customerMapper.toEntity(customerDTO);
        return customerMapper.toDTO(customerRepository.save(customer));
    }

    public DashboardStatsDTO getCustomerDashboardStats() {
        List<Customer> allCustomers = customerRepository.findAll();
        long totalCustomers = allCustomers.size();

        // Calcular saldo total
        BigDecimal totalBalance = allCustomers.stream()
                .map(customer -> BigDecimal.valueOf(customer.getBalance()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calcular saldo promedio
        BigDecimal averageBalance = BigDecimal.ZERO;
        if (totalCustomers > 0) {
            averageBalance = totalBalance.divide(
                    BigDecimal.valueOf(totalCustomers), 2, java.math.RoundingMode.HALF_UP
            );
        }

        // Calcular total de transacciones
        long totalTransactions = transactionRepository.count();

        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalCustomers(totalCustomers);
        stats.setTotalBalance(totalBalance);
        stats.setAverageBalance(averageBalance);
        stats.setTotalTransactions(totalTransactions);

        return stats;
    }
}