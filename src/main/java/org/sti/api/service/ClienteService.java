package org.sti.api.service;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sti.api.domain.Cliente;
import org.sti.api.dto.ClienteInDto;
import org.sti.api.dto.ClienteOutDto;
import org.sti.api.exception.ClienteNotFoundException;
import org.sti.api.repository.ClienteRepository;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ModelMapper modelMapper;

    public ClienteOutDto add(ClienteInDto clienteInDto) {
        Cliente cliente = modelMapper.map(clienteInDto, Cliente.class);
        Cliente savedCliente = clienteRepository.save(cliente);
        return modelMapper.map(savedCliente, ClienteOutDto.class);
    }

    public List<ClienteOutDto> findAll() {
        List<Cliente> clientes = clienteRepository.findAll();
        return modelMapper.map(clientes, new TypeToken<List<ClienteOutDto>>() {}.getType());
    }

    public ClienteOutDto findById(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ClienteNotFoundException("Cliente no encontrado con ID: " + id));
        return modelMapper.map(cliente, ClienteOutDto.class);
    }

    public ClienteOutDto modify(Long id, ClienteInDto clienteInDto) {
        Cliente existingCliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ClienteNotFoundException("Cliente no encontrado con ID: " + id));
        modelMapper.map(clienteInDto, existingCliente);
        existingCliente.setId(id);
        Cliente savedCliente = clienteRepository.save(existingCliente);
        return modelMapper.map(savedCliente, ClienteOutDto.class);
    }

    public void delete(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ClienteNotFoundException("Cliente no encontrado con ID: " + id));
        clienteRepository.delete(cliente);
    }
}
