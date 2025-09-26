package com.udea.bancoudea.service;

import com.udea.bancoudea.DTO.CustomerDTO;
import com.udea.bancoudea.DTO.DashboardStatsDTO;
import com.udea.bancoudea.entity.Customer;
import com.udea.bancoudea.mapper.CustomerMapper;
import com.udea.bancoudea.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.udea.bancoudea.repository.TransactionRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final TransactionRepository transactionRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository, CustomerMapper customerMapper, TransactionRepository transactionRepository) {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
        this.transactionRepository = transactionRepository;
    }

    public List<CustomerDTO> getAllCustomer(){
        return customerRepository.findAll().stream()
                .map(customerMapper::toDTO).toList();
    }

    public CustomerDTO getCustomerById(Long id){
        return customerRepository.findById(id).map(customerMapper::toDTO)
                .orElseThrow(()->new RuntimeException("Cliente no encontrado"));
    }

    public CustomerDTO createCustomer(CustomerDTO customerDTO){
        Customer customer = customerMapper.toEntity(customerDTO);
        return customerMapper.toDTO(customerRepository.save(customer));
    }

    public DashboardStatsDTO getCustomerDashboardStats(){
        List<Customer> allCustomers = customerRepository.findAll();
        long totalCustomers = allCustomers.size();

        // Calcular saldo total (Correcto)
        BigDecimal totalBalance = allCustomers.stream()
                .map(customer -> BigDecimal.valueOf(customer.getBalance()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calcular saldo promedio (Correcto)
        BigDecimal averageBalance = BigDecimal.ZERO;
        if (totalCustomers > 0) {
            averageBalance = totalBalance.divide(
                    BigDecimal.valueOf(totalCustomers),
                    2, // Escala: 2 decimales
                    java.math.RoundingMode.HALF_UP
            );
        }

        // Calcular total de transacciones (Ahora que el método existe)
        long totalTransactions = transactionRepository.count();


        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalCustomers(totalCustomers);
        stats.setTotalBalance(totalBalance);
        stats.setAverageBalance(averageBalance);

        stats.setTotalTransactions(totalTransactions);

        return stats;
    }
}